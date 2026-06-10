import { type KeyboardEvent } from "react";

interface Props {
  input: string;
  onChange: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
  inputTooLong: boolean;
  maxLength: number;
}

export function ChatInput({ input, onChange, onSend, isLoading, inputTooLong, maxLength }: Props) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim() && !inputTooLong) onSend();
    }
  };

  const canSend = !isLoading && input.trim().length > 0 && !inputTooLong;
  const nearLimit = input.length > maxLength * 0.8;

  return (
    <div className="px-4 pt-3 pb-3.5 border-t border-slate-200 bg-white shrink-0">
      <div
        className={`flex items-end gap-2 bg-slate-100 rounded-2xl px-3.5 py-2 border-2 transition-colors
          ${inputTooLong
            ? "border-red-400 focus-within:border-red-400"
            : "border-transparent focus-within:border-blue-500 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
          }`}
      >
        <textarea
          className="flex-1 resize-none bg-transparent text-[0.9375rem] leading-relaxed text-slate-900 placeholder:text-slate-400 outline-none max-h-[120px] overflow-y-auto disabled:opacity-60 disabled:cursor-not-allowed"
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          disabled={isLoading}
          rows={1}
          aria-label="Message input"
          aria-invalid={inputTooLong}
        />

        <button
          onClick={onSend}
          disabled={!canSend}
          aria-label="Send message"
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all
            ${canSend
              ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      <div className="mt-1.5 min-h-4 px-1">
        {inputTooLong ? (
          <span className="text-xs text-red-500 font-medium">
            Message too long ({input.length}/{maxLength})
          </span>
        ) : (
          <span className="text-xs text-slate-400">
            {nearLimit
              ? `${maxLength - input.length} characters left`
              : "Enter to send · Shift+Enter for new line"}
          </span>
        )}
      </div>
    </div>
  );
}