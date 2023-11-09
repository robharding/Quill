import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { trpc } from "@/app/_trpc/client";
import { Loader2, MessageSquareIcon } from "lucide-react";
import { FC, useContext, useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import Message from "./Message";
import { ChatContext } from "./ChatContext";
import { useIntersection } from "@mantine/hooks";

interface MessagesProps {
  fileId: string;
}

const Messages: FC<MessagesProps> = ({ fileId }) => {
  const { isLoading: isAiThinking } = useContext(ChatContext);

  const { data, isLoading, isFetching, fetchNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      {
        fileId,
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        keepPreviousData: true,
      }
    );

  const messages = data?.pages.flatMap((page) => page.messages) ?? [];
  const loadingMessage = {
    id: "loading-message",
    createdAt: new Date().toISOString(),
    isUserMessage: false,
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  const combinedMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...messages,
  ];

  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, i) => {
          const isNextMessageSamePerson =
            combinedMessages[i - 1]?.isUserMessage === message.isUserMessage;

          if (i === combinedMessages.length - 1) {
            return (
              <Message
                key={message.id}
                message={message}
                isNextMessageSamePerson={isNextMessageSamePerson}
                ref={ref}
              />
            );
          } else
            return (
              <Message
                key={message.id}
                message={message}
                isNextMessageSamePerson={isNextMessageSamePerson}
              />
            );
        })
      ) : isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <h3 className="font-semibold text-xl">Loading</h3>
          <p className="text-zinc-500 text-sm">
            Fetching your previous messages...
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquareIcon className="h-8 w-8 text-blue-500" />
          <h3 className="font-semibold text-xl">You&apos;re all set!</h3>
          <p className="text-zinc-500 text-sm">
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
