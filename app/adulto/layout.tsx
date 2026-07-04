import { requireElder } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/AppShell";

export default async function AdultoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { elder } = await requireElder();

  return (
    <AppShell role="elder" userName={elder.full_name}>
      {children}
    </AppShell>
  );
}
