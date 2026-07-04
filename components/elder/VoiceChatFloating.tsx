"use client";

import { MessageCircle } from "lucide-react";
import { VoiceChatPanel } from "@/components/elder/VoiceChatPanel";
import { useVoiceChat } from "@/components/elder/voice-chat-context";
import { cn } from "@/lib/utils";

export function VoiceChatFloating() {
  const { isOpen, setOpen, toggleOpen, status } = useVoiceChat();
  const isActive = status !== "idle";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-care-foreground/25 backdrop-blur-[2px] lg:bg-transparent lg:backdrop-blur-none"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="fixed bottom-24 right-4 z-[70] flex flex-col items-end gap-3 lg:bottom-6">
        {isOpen && (
          <div
            className="w-[min(100vw-2rem,22rem)] overflow-hidden rounded-3xl border-2 border-care-secondary/60 shadow-2xl lg:w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <VoiceChatPanel variant="floating" onClose={() => setOpen(false)} />
          </div>
        )}

        <button
          type="button"
          onClick={toggleOpen}
          aria-label={isOpen ? "Cerrar acompañante" : "Abrir acompañante de voz"}
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95",
            isOpen
              ? "bg-care-accent-dark text-white"
              : "bg-care-accent-dark text-white ring-4 ring-care-accent/30",
            isActive && !isOpen && "animate-pulse ring-red-300"
          )}
        >
          <MessageCircle className="h-8 w-8" />
        </button>
      </div>
    </>
  );
}
