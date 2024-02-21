import ChatWrapper from "@/components/chat/ChatWrapper";
import PdfRenderer from "@/components/PdfRenderer";
import { db } from "@/db";
import { validateRequest } from "@/lib/auth";
import type { NextPage } from "next";
import { notFound, redirect } from "next/navigation";

interface FilePageProps {
  params: {
    fileId: string;
  };
}

const FilePage: NextPage<FilePageProps> = async ({ params: { fileId } }) => {
  const { user } = await validateRequest();

  if (!user || !user.id) redirect(`/login`);

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!file) notFound();

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2 ">
        <div className="flex-1 xl:flex ">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PdfRenderer url={file.url} />
          </div>
        </div>
        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper fileId={file.id}></ChatWrapper>
        </div>
      </div>
    </div>
  );
};

export default FilePage;
