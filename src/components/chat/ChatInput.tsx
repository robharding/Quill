import { FC, useContext, useRef } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2, Send } from "lucide-react";
import { ChatContext } from "./ChatContext";

interface ChatInputProps {
  isDisabled?: boolean;
}

const ChatInput: FC<ChatInputProps> = ({ isDisabled }) => {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="absolute bottom-0 left-0 w-full bg-inherit">
      <form className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                placeholder="Enter your question..."
                rows={1}
                maxRows={4}
                autoFocus
                className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch "
                disabled={isDisabled}
                onChange={handleInputChange}
                ref={textareaRef}
                onKeyDown={(e) => {
                  if (
                    e.key == "Enter" &&
                    !e.shiftKey &&
                    message.trim().length !== 0
                  ) {
                    e.preventDefault();
                    addMessage();
                    textareaRef.current?.focus();
                  }
                }}
                value={message}
              />

              <Button
                className="absolute bottom-1.5 right-[8px]"
                aria-label="send message"
                disabled={
                  isLoading || isDisabled || message.trim().length === 0
                }
                onClick={() => {
                  addMessage();
                  textareaRef.current?.focus();
                }}
                type="submit"
              >
                {isLoading || isDisabled ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
