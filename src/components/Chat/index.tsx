"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { getResponse, QUICK_QUESTIONS } from "./hardcodedResponses";
import { ChatBubbleBottomCenterTextIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

// ─── Types ─────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  typing?: boolean;
}

function uid(): string {
  return Math.random().toString(36).slice(2);
}

// ─── Message bubble ─────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && (
        <div className="size-7 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
          <ChatBubbleBottomCenterTextIcon className="size-4 text-secondary" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
          isUser
            ? "bg-blue text-white rounded-tr-sm"
            : "bg-accent text-primary rounded-tl-sm"
        }`}
      >
        {message.typing ? (
          <span className="inline-flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="size-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="size-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }} />
          </span>
        ) : (
          <span className="whitespace-pre-wrap">{message.content}</span>
        )}
      </div>
    </div>
  );
}

// ─── Chat ───────────────────────────────────────────────────────────────────

interface ChatProps {
  initialQuestion?: string;
}

export default function Chat({ initialQuestion }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const initRef = useRef(false);

  const scrollBottom = useCallback(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;
      setInput("");
      const userMsg: Message = { id: uid(), role: "user", content: text.trim() };
      const typingMsg: Message = { id: "typing", role: "assistant", content: "", typing: true };

      setMessages((prev) => [...prev, userMsg, typingMsg]);
      setIsTyping(true);
      scrollBottom();

      const delay = 300 + Math.random() * 700;
      await new Promise((res) => setTimeout(res, delay));

      const response = getResponse(text);
      setMessages((prev) => prev.filter((m) => m.id !== "typing"));
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "assistant", content: response },
      ]);
      setIsTyping(false);
      scrollBottom();
    },
    [isTyping, scrollBottom]
  );

  useEffect(() => {
    if (initRef.current || !initialQuestion) return;
    initRef.current = true;
    sendMessage(initialQuestion);
  }, [initialQuestion, sendMessage]);

  useEffect(() => {
    if (!initialQuestion) inputRef.current?.focus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full" data-scheme="primary">
      {/* Header */}
      <div
        data-scheme="secondary"
        className="flex items-center gap-2 px-3 py-2 border-b border-primary bg-primary shrink-0"
      >
        <div className="size-7 rounded-full bg-accent flex items-center justify-center shrink-0">
          <ChatBubbleBottomCenterTextIcon className="size-4 text-secondary" />
        </div>
        <div>
          <div className="text-xs font-semibold text-primary">Max</div>
          <div className="text-[10px] text-muted">AI Assistant</div>
        </div>
        <span className="ml-auto text-[10px] text-muted">Hardcoded responses</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-6 gap-4">
            <div className="size-14 rounded-full bg-accent flex items-center justify-center">
              <ChatBubbleBottomCenterTextIcon className="size-7 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">Hi, I&apos;m Max!</p>
              <p className="text-xs text-muted mt-1">Ask me anything about this desktop</p>
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs text-left px-3 py-2 rounded-lg border border-primary hover:bg-accent transition-colors text-secondary focus:outline-none focus-visible:ring-1 focus-visible:ring-blue"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => <MessageBubble key={m.id} message={m} />)
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        data-scheme="secondary"
        className="flex items-center gap-2 px-3 py-2 border-t border-primary bg-primary shrink-0"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
          placeholder="Ask Max anything..."
          className="flex-1 text-xs bg-transparent text-primary placeholder-muted outline-none py-1"
          disabled={isTyping}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
          className="size-7 flex items-center justify-center rounded-full bg-blue text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity focus:outline-none shrink-0"
          aria-label="Send"
        >
          <PaperAirplaneIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
