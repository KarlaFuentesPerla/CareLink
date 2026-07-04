"use client";

import { useState } from "react";
import { Loader2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReminderPlayerProps {
  reminderType?: string;
  defaultText?: string;
}

function speakWithBrowser(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!("speechSynthesis" in window)) {
      reject(new Error("No speech synthesis"));
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-MX";
    utterance.rate = 0.9;
    utterance.onend = () => resolve();
    utterance.onerror = () => reject(new Error("Speech failed"));
    window.speechSynthesis.speak(utterance);
  });
}

export function ReminderPlayer({
  reminderType = "medication",
  defaultText,
}: ReminderPlayerProps) {
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);

  async function playReminder() {
    setLoading(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: defaultText,
          type: reminderType,
          voice: "warm_spanish_voice",
        }),
      });
      const data = await res.json();
      const text = data.text ?? defaultText ?? "";

      setPlaying(true);

      if (data.source === "elevenlabs" || data.source === "elevenlabs-inline") {
        const audio = new Audio(data.audioUrl);
        audio.onended = () => setPlaying(false);
        audio.onerror = async () => {
          await speakWithBrowser(text);
          setPlaying(false);
        };
        await audio.play();
      } else {
        await speakWithBrowser(text);
        setPlaying(false);
      }
    } catch {
      if (defaultText) {
        setPlaying(true);
        await speakWithBrowser(defaultText);
        setPlaying(false);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="lg"
      variant="secondary"
      onClick={playReminder}
      disabled={loading || playing}
      className="w-full text-lg"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Volume2 className="h-5 w-5" />
      )}
      {playing ? "Reproduciendo..." : "Escuchar recordatorio"}
    </Button>
  );
}
