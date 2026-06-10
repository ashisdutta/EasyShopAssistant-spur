import { useState, useEffect, useRef, useCallback } from "react";
import { sendMessage, fetchHistory,type Message } from "../api/chat";

const SESSION_KEY = "easyshop_session_id";
const MAX_LENGTH = 500;

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const sessionIdRef = useRef<string | undefined>(
        localStorage.getItem(SESSION_KEY) ?? undefined
    );


    useEffect(() => {
        const storedSession = localStorage.getItem(SESSION_KEY);
        if (!storedSession) return;

        setIsLoadingHistory(true);
        fetchHistory(storedSession)
        .then(({ messages: history }) => {
            setMessages(history);
        })
        .catch(() => {
            localStorage.removeItem(SESSION_KEY);
            sessionIdRef.current = undefined;
        })
        .finally(() => setIsLoadingHistory(false));
    }, []);

    const send = useCallback(async () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        const userMessage: Message = { sender: "user", text: trimmed };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setError(null);
        setIsLoading(true);

        try {
        const { reply, sessionId } = await sendMessage(
            trimmed,
            sessionIdRef.current
        );

        sessionIdRef.current = sessionId;
        localStorage.setItem(SESSION_KEY, sessionId);

        const aiMessage: Message = { sender: "ai", text: reply };
        setMessages((prev) => [...prev, aiMessage]);
        } catch (err: unknown) {
        const msg =
            err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
        setError(msg);
        setMessages((prev) => prev.slice(0, -1));
        setInput(trimmed);
        } finally {
        setIsLoading(false);
        }
    }, [input, isLoading]);

    const clearSession = useCallback(() => {
        localStorage.removeItem(SESSION_KEY);
        sessionIdRef.current = undefined;
        setMessages([]);
        setError(null);
        setInput("");
    }, []);

    const inputTooLong = input.length > MAX_LENGTH;

    return {
        messages,
        input,
        setInput,
        isLoading,
        isLoadingHistory,
        error,
        send,
        clearSession,
        inputTooLong,
        maxLength: MAX_LENGTH,
    };
    }