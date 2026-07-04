"use client";

import { useEffect, useRef } from "react";
import { Loader2, Mic, MicOff, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceChat } from "@/components/elder/voice-chat-context";
import { cn } from "@/lib/utils";

interface VoiceChatPanelProps {
  variant?: "embedded" | "floating";
  onClose?: () => void;
}

export function VoiceChatPanel({ variant = "embedded", onClose }: VoiceChatPanelProps) {
  const {
    messages,
    status,
    error,
    recordingSupported,
    toggleRecording,
    statusLabel,
  } = useVoiceChat();

  const chatEndRef = useRef<HTMLDivElement>(null);
  const busy = status === "processing" || status === "speaking";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden bg-white",
        variant === "embedded" ? "care-surface" : "h-full rounded-t-3xl shadow-2xl"
      )}
    >
      <div className="flex items-center justify-between border-b border-care-secondary/50 bg-care-primary/40 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-care-accent/30 text-care-accent-darker">
            <Volume2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-care-foreground">CareLink</h3>
            <p className="text-sm text-care-muted">Acompañante de voz</p>
          </div>
        </div>
        {variant === "floating" && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-care-muted hover:bg-care-secondary/40"
            aria-label="Cerrar chat"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div
        className={cn(
          "flex flex-col gap-3 overflow-y-auto px-4 py-4",
          variant === "embedded"
            ? "max-h-[min(24rem,50vh)]"
            : "min-h-[14rem] flex-1 max-h-[50vh]"
        )}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "max-w-[90%] rounded-2xl px-4 py-3 text-base leading-relaxed",
              msg.role === "user"
                ? "ml-auto bg-care-accent-dark text-white"
                : "mr-auto border-2 border-care-secondary/60 bg-care-primary/30 text-care-foreground"
            )}
          >
            <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide opacity-75">
              {msg.role === "user" ? "Usted" : "CareLink"}
            </p>
            <p>{msg.content}</p>
          </div>
        ))}
        {busy && (
          <div className="mr-auto flex items-center gap-2 rounded-2xl border-2 border-care-secondary/60 bg-white px-4 py-2 text-care-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">{statusLabel}</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {error && (
        <div className="mx-4 mb-2 rounded-xl border-2 border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
          {error}
        </div>
      )}

      <div className="border-t border-care-secondary/50 bg-care-primary/30 px-4 py-4">
        <p className="mb-3 text-center text-sm font-semibold text-care-muted">{statusLabel}</p>
        <Button
          type="button"
          size="lg"
          variant={status === "recording" ? "destructive" : "default"}
          disabled={!recordingSupported || busy}
          onClick={toggleRecording}
          className="w-full text-lg"
        >
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : status === "recording" ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
          {status === "recording" ? "Enviar" : "Hablar"}
        </Button>
      </div>
    </div>
  );
}
