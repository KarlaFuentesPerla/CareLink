import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";

const schema = z.object({
  elderId: z.string().uuid(),
  name: z.string(),
  time: z.string(),
});

export async function POST(req: NextRequest) {
  const body = schema.parse(await req.json());
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("medications")
    .insert({
      elder_id: body.elderId,
      name: body.name,
      time: body.time,
      scheduled_time: body.time,
      active: true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, medication: data });
}
