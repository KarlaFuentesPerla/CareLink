import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateICS } from "@/lib/calendar/ics";
import { verifyCaregiverElderAccess } from "@/lib/auth/session";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: appointment, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !appointment) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const hasAccess =
    (await verifyCaregiverElderAccess(user.id, appointment.elder_id)) ||
    (await supabase
      .from("elders")
      .select("id")
      .eq("id", appointment.elder_id)
      .eq("auth_user_id", user.id)
      .single()).data;

  if (!hasAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const start = new Date(appointment.starts_at);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const ics = generateICS({
    uid: `carelink-${appointment.id}@carelink.app`,
    summary: appointment.title,
    description: appointment.notes ?? `CareLink — ${appointment.type}`,
    start,
    end,
  });

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${appointment.title.replace(/\s+/g, "-")}.ics"`,
    },
  });
}
