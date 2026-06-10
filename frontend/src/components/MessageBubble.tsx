import { type Message } from "../api/chat";

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex items-end gap-2 max-w-[88%] animate-[fadeUp_0.18s_ease-out] ${isUser ? "self-end flex-row-reverse" : "self-start"}`}>

      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="4" fill="currentColor" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      <div
        className={`px-3.5 py-2.5 text-[0.9375rem] leading-relaxed break-words whitespace-pre-wrap
          ${isUser
            ? "bg-blue-600 text-white rounded-[18px] rounded-br-[4px]"
            : "bg-slate-100 text-slate-800 rounded-[18px] rounded-bl-[4px]"
          }`}
      >
        {message.text}
      </div>
    </div>
  );
}