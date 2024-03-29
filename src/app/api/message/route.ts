import { db } from "@/db";
import openai from "@/lib/openai";
import { pinecone } from "@/lib/pinecone";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { NextRequest } from "next/server";

import { OpenAIStream, StreamingTextResponse } from "ai";
import { validateRequest } from "@/lib/auth";

// Use edge because of longer streaming timeouts on vercel
export const runtime = "edge";

export const POST = async (req: NextRequest) => {
  // endpoint for asking a question to a pdf file

  const body = await req.json();

  const { user } = await validateRequest();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { fileId, message } = SendMessageValidator.parse(body);

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!file) return new Response("File not found", { status: 404 });

  await db.message.create({
    data: {
      fileId,
      text: message,
      isUserMessage: true,
      userId: user.id,
    },
  });

  // 1: vectorize message

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY!,
  });

  const pineconeIndex = pinecone.Index("quill").namespace(user.id);

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
  });

  // TODO: paid users get higher k
  const results = await vectorStore.similaritySearch(message, 4, {
    "file.id": fileId,
  });

  const prevMessages = await db.message.findMany({
    where: {
      fileId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 6,
  });

  const formattedPrevMessages = prevMessages.map((message) => ({
    role: message.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: message.text,
  }));

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0,
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversation as needed) to answer the users question in markdown format.",
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversation if needed) to answer the users questions in markdown format. \nIf you don't know the answer, just say that you don't know, don't try and make up an answer.
        
        \n-------------------\n

        PREVIOUS CONVERSATION:
        ${formattedPrevMessages.map((message) => {
          if (message.role === "user") return `User: ${message.content}\n`;
          return `Assistant: ${message.content}\n`;
        })}
         
        \n-------------------\n

        CONTEXT:
        ${results.map((r) => r.pageContent).join("\n\n")}

        \n-------------------\n

        USER INPUT: ${message}`,
      },
    ],
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await db.message.create({
        data: {
          fileId,
          text: completion,
          isUserMessage: false,
          userId: user.id,
        },
      });
    },
  });

  return new StreamingTextResponse(stream);
};
