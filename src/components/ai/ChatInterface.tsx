"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Brain, User, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Salue ! Je suis votre conseiller économique ESSOR. Je peux analyser vos factures, évaluer vos marges et vous aider à optimiser votre stratégie financière. Comment puis-je vous éclairer aujourd'hui ?",
    },
  ]);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar?: string;
  } | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        // console.error("Error parsing user data", e);
      }
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const userStr = localStorage.getItem("user");
      const token = userStr ? JSON.parse(userStr).token : "";

      const response = await fetch("/api/ai/advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ]);
      } else {
        throw new Error("Failed to get response");
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Désolé, j'ai rencontré une erreur technique lors de l'analyse de vos données. Veuillez réessayer dans quelques instants.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Analyse mes finances",
    "Mes marges sont-elles saines ?",
    "État de ma trésorerie",
    "Conseils de croissance",
  ];

  return (
    <div className="flex flex-col h-[75vh] w-full max-w-4xl mx-auto bg-card/30 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      {/* Header Decorative Sparkle */}
      <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
        <Sparkles className="w-12 h-12 text-primary animate-pulse" />
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-none"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex items-start gap-4 animate-fade-in-up",
              msg.role === "user" ? "flex-row-reverse" : "flex-row",
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                msg.role === "assistant"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-secondary/10 text-secondary border border-secondary/20",
              )}
            >
              {msg.role === "assistant" ? (
                <Brain className="w-5 h-5" />
              ) : (
                <Avatar className="h-full w-full rounded-xl">
                  <AvatarImage
                    alt={user?.name}
                    src={user?.avatar}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {user?.name?.substring(0, 2).toUpperCase() || (
                      <User size={18} />
                    )}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] p-5 rounded-3xl text-sm leading-relaxed font-sans",
                msg.role === "assistant"
                  ? "bg-white/5 border border-white/10 text-foreground rounded-tl-none"
                  : "bg-primary text-primary-foreground rounded-tr-none shadow-xl shadow-primary/20",
              )}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl rounded-tl-none italic text-muted-foreground text-sm">
              Analyse de vos données financières en cours...
            </div>
          </div>
        )}
      </div>

      {/* Toolbar / Suggestions */}
      <div className="px-6 md:px-10 pb-4 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setInput(s)}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 md:p-10 pt-0">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Posez une question sur votre stratégie économique..."
            className="w-full bg-slate-950/50 border border-border/50 rounded-2xl p-5 pr-16 text-sm placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-sans"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-primary hover:bg-primary/90 p-0 shadow-lg shadow-primary/20"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="mt-4 text-[10px] text-center text-muted-foreground font-medium uppercase tracking-[0.2em] opacity-50">
          Propulsé par Pulse™ IA Architecture
        </p>
      </div>
    </div>
  );
}
