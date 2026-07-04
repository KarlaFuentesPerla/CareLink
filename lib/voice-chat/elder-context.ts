import { fetchElderCarePlan, type ElderCarePlan } from "@/lib/data/elder-care-plan";
import { createClient } from "@/lib/supabase/server";
import type { Elder } from "@/types/database";

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatFoodRules(plan: ElderCarePlan): string[] {
  const groups: Record<string, string[]> = {
    prohibited: [],
    reduce: [],
    recommendation: [],
    allergen: [],
  };

  for (const rule of plan.foodRules) {
    groups[rule.type]?.push(rule.label);
  }

  const lines: string[] = [];
  if (groups.prohibited.length) {
    lines.push(`Evitar: ${groups.prohibited.join(", ")}.`);
  }
  if (groups.reduce.length) {
    lines.push(`Reducir: ${groups.reduce.join(", ")}.`);
  }
  if (groups.recommendation.length) {
    lines.push(`Recomendado: ${groups.recommendation.join(", ")}.`);
  }
  if (groups.allergen.length) {
    lines.push(`Alérgenos: ${groups.allergen.join(", ")}.`);
  }
  return lines;
}

export function formatElderChatContext(elder: Elder, plan: ElderCarePlan): string {
  const sections: string[] = [];
  const today = capitalize(
    new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })
  );

  sections.push(`Hoy es ${today}.`);

  const family: string[] = [];
  if (elder.main_caregiver_name) {
    family.push(`su cuidador/a principal es ${elder.main_caregiver_name}`);
  }
  if (elder.emergency_contact) {
    family.push(`contacto de emergencia: ${elder.emergency_contact}`);
  }
  if (family.length) {
    sections.push(`Familia y cuidadores: ${family.join("; ")}.`);
  }

  if (plan.featuredMedicationDoses.length) {
    const doses = plan.featuredMedicationDoses
      .map(
        (d) =>
          `${d.title}${d.subtitle ? ` (${d.subtitle})` : ""} a las ${d.time}${d.dateLabel ? ` (${d.dateLabel})` : ""}`
      )
      .join("; ");
    sections.push(`Próximo(s) medicamento(s): ${doses}.`);
  }

  if (plan.medications.length) {
    const allMeds = plan.medications
      .map((m) => {
        const todayTimes =
          m.appliesToday && m.timesTodayLabels.length
            ? ` — hoy: ${m.timesTodayLabels.join(", ")}`
            : "";
        return `${m.name}${m.dose ? ` (${m.dose})` : ""}: ${m.scheduleSummary}${todayTimes}`;
      })
      .join("; ");
    sections.push(`Medicamentos del plan: ${allMeds}.`);
  }

  if (plan.meals.length) {
    const meals = plan.meals
      .map(
        (m) =>
          `${m.label} a las ${m.timeLabel}${m.status === "completed" ? " (ya registrada)" : ""}`
      )
      .join("; ");
    sections.push(`Comidas de hoy: ${meals}.`);
  }

  if (plan.routineActivities.length) {
    const activities = plan.routineActivities
      .map((a) => `${a.title} a las ${a.timeLabel}`)
      .join("; ");
    sections.push(`Actividades de rutina: ${activities}.`);
  }

  const upcomingAppts = plan.appointments.filter((a) => !a.isPast);
  if (upcomingAppts.length) {
    const appts = upcomingAppts
      .slice(0, 4)
      .map((a) => `${a.title} (${a.typeLabel}) — ${a.dateLabel} ${a.timeLabel}`)
      .join("; ");
    sections.push(`Citas y exámenes próximos: ${appts}.`);
  }

  const foodLines = formatFoodRules(plan);
  if (foodLines.length) {
    sections.push(`Alimentación (presión alta): ${foodLines.join(" ")}`);
  }

  if (elder.mood_today) {
    sections.push(`Estado de ánimo registrado hoy: ${elder.mood_today}.`);
  }

  return sections.join("\n");
}

export async function loadElderChatContext(elder: Elder): Promise<string> {
  const supabase = await createClient();
  const plan = await fetchElderCarePlan(elder.id, supabase);
  return formatElderChatContext(elder, plan);
}
