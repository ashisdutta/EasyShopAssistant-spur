import { useChat } from "../hooks/useChat";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

export function ChatMain() {
  const {
    messages, input, setInput,
    isLoading, isLoadingHistory,
    error, send, clearSession,
    inputTooLong, maxLength,
  } = useChat();

  return (
    <div
      className="flex flex-col w-full max-w-[480px] h-[min(700px,90vh)] bg-white rounded-2xl shadow-2xl overflow-hidden"
      role="region"
      aria-label="ShopEase Support Chat"
    >
      <div className="flex items-center justify-between px-5 py-4 bg-blue-600 text-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div>
            <p className="text-[0.9375rem] font-semibold leading-tight">EasyShop Support</p>
            <p className="text-xs opacity-80 leading-tight mt-0.5">Online · Typically replies instantly</p>
          </div>
        </div>

        <button
          onClick={clearSession}
          title="Start a new conversation"
          aria-label="Start a new conversation"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/50 text-white text-[0.8125rem] font-medium hover:bg-white/15 hover:border-white/80 transition-colors whitespace-nowrap"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          New chat
        </button>
      </div>

      <MessageList messages={messages} isLoading={isLoading} isLoadingHistory={isLoadingHistory} />

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-500 text-[0.8125rem] font-medium border-t border-red-200 shrink-0"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {error}
        </div>
      )}

      <ChatInput
        input={input}
        onChange={setInput}
        onSend={send}
        isLoading={isLoading}
        inputTooLong={inputTooLong}
        maxLength={maxLength}
      />
    </div>
  );
}