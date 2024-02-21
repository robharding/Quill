import { db } from "@/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { pinecone } from "@/lib/pinecone";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";
import { validateRequest } from "@/lib/auth";

const f = createUploadthing();

const middleware = async () => {
  const { user } = await validateRequest();

  if (!user || !user.id) throw new Error("Unauthorized");

  const subscriptionPlan = await getUserSubscriptionPlan();

  return { userId: user.id, subscriptionPlan };
};

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: { userId: string; subscriptionPlan: { isSubscribed: boolean } };
  file: { key: string; name: string };
}) => {
  // make sure we dont recreate the same file
  const existingFile = await db.file.findFirst({
    where: { key: file.key },
  });
  if (existingFile) return;

  // create file in our db
  const createdFile = await db.file.create({
    data: {
      key: file.key,
      userId: metadata.userId,
      name: file.name,
      url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
      uploadStatus: "PROCESSING",
    },
  });

  try {
    // fetch pdf from s3
    const response = await fetch(
      `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
    );
    const blob = await response.blob();

    // load pdf into memory, store file id in metadata so we can associate pages with file
    const loader = new PDFLoader(blob);
    const pageLevelDocs = (await loader.load()).map((doc) => {
      return {
        ...doc,
        metadata: {
          ...doc.metadata,
          "file.id": createdFile.id,
        },
      };
    });

    // check if user has enough allowed pdf pages for their plan
    const pagesAmt = pageLevelDocs.length;
    const {
      subscriptionPlan: { isSubscribed },
    } = metadata;

    const isProExceeded =
      pagesAmt > PLANS.find((plan) => plan.name === "Pro")!.pagesPerPdf;
    const isFreeExceeded =
      pagesAmt > PLANS.find((plan) => plan.name === "Free")!.pagesPerPdf;

    if ((!isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)) {
      throw new Error("Too many pages!");
    }

    // vectorize and index entire document
    const pineconeIndex = pinecone.Index("quill").namespace(metadata.userId);

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
    });

    await db.file.update({
      where: { id: createdFile.id },
      data: {
        uploadStatus: "SUCCESS",
      },
    });
  } catch (err) {
    await db.file.update({
      where: { id: createdFile.id },
      data: {
        uploadStatus: "FAILED",
      },
    });
  }
};

export const ourFileRouter = {
  freeUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
