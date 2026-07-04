import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateSpeech, hasElevenLabs } from "@/lib/elevenlabs/tts";
import { createAdminClient } from "@/lib/supabase/server";
import { FALLBACK_TTS_TEXTS } from "@/lib/demo-data/fallback-messages";

const schema = z.object({
  text: z.string().optional(),
  type: z.string().optional(),
  voice: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = schema.parse(await req.json());
  const text =
    body.text ??
    FALLBACK_TTS_TEXTS[body.type ?? "medication"] ??
    FALLBACK_TTS_TEXTS.medication;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!hasElevenLabs()) {
    return NextResponse.json({
      audioUrl: `${appUrl}/api/tts/fallback?type=${body.type ?? "medication"}`,
      source: "fallback",
      text,
    });
  }

  try {
    const audioBuffer = await generateSpeech(text);
    if (!audioBuffer) {
      return NextResponse.json({
        audioUrl: `${appUrl}/api/tts/fallback?type=${body.type ?? "medication"}`,
        source: "fallback",
        text,
      });
    }

    const supabase = createAdminClient();
    const fileName = `reminders/${body.type ?? "custom"}-${Date.now()}.mp3`;

    const { error } = await supabase.storage
      .from("carelink-audios")
      .upload(fileName, audioBuffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (error) {
      const base64 = Buffer.from(audioBuffer).toString("base64");
      return NextResponse.json({
        audioUrl: `data:audio/mpeg;base64,${base64}`,
        source: "elevenlabs-inline",
        text,
      });
    }

    const { data } = supabase.storage.from("carelink-audios").getPublicUrl(fileName);

    return NextResponse.json({
      audioUrl: data.publicUrl,
      source: "elevenlabs",
      text,
    });
  } catch {
    return NextResponse.json({
      audioUrl: `${appUrl}/api/tts/fallback?type=${body.type ?? "medication"}`,
      source: "fallback",
      text,
    });
  }
}
