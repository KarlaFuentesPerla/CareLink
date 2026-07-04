import { requireElder } from "@/lib/auth/session";
import { AdultoPortal } from "@/components/elder/AdultoPortal";

export default async function AdultoPage() {
  const { elder } = await requireElder();
  return <AdultoPortal elderName={elder.full_name} />;
}
