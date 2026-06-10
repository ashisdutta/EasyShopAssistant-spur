import { useEffect, useRef } from "react";
import { type Message } from "../api/chat";
import { MessageBubble } from "./MessageBubble";

interface Props {
  messages: Message[];
  isLoading: boolean;
  isLoadingHistory: boolean;
}

export function MessageList({ messages, isLoading, isLoadingHistory }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (isLoadingHistory) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Loading your conversation…
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-2.5 scroll-smooth"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 text-center gap-2 py-8">

          <p className="text-base font-semibold text-slate-800">Hi! I'm the EasyShop assistant.</p>
          <p className="text-sm text-slate-500 max-w-[280px] leading-relaxed">
            Ask me about shipping, returns, or anything about your order.
          </p>
        </div>
      )}

      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} />
      ))}

      {isLoading && (
        <div className="flex items-end gap-2 self-start">
          <div className="bg-slate-100 rounded-[18px] rounded-bl-[4px] px-4 py-3 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}