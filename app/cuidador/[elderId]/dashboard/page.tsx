import { DashboardView } from "@/components/dashboard/DashboardView";

export default async function ElderDashboardPage({
  params,
}: {
  params: Promise<{ elderId: string }>;
}) {
  const { elderId } = await params;
  return <DashboardView elderId={elderId} />;
}
