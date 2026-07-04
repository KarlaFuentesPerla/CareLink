function formatICSDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

export interface ICSEvent {
  uid: string;
  summary: string;
  description?: string;
  start: Date;
  end: Date;
}

export function generateICS(event: ICSEvent): string {
  const now = formatICSDate(new Date());
  const dtStart = formatICSDate(event.start);
  const dtEnd = formatICSDate(event.end);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CareLink//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${event.summary}`,
    event.description ? `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}
