import Link from "next/link";
import { Check, Heart, Shield } from "lucide-react";
import { getSessionUser, getProfile } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { IconBox } from "@/components/ui/icon-box";

const PORTALS = [
  {
    href: "/login?redirect=/adulto",
    title: "Portal adulto mayor",
    description: "Interfaz simple con botones grandes para la rutina diaria.",
    icon: Heart,
    features: ["Recordatorios en voz", "Confirmar medicamento y comida", "Pedir ayuda a la familia"],
    variant: "default" as const,
  },
  {
    href: "/login?redirect=/cuidador/resumen",
    title: "Portal familiar",
    description: "Panel de seguimiento para quienes cuidan a un adulto mayor.",
    icon: Shield,
    features: ["Panel general y alertas", "Gráficas de actividad", "Plan de medicamentos y citas"],
    variant: "outline" as const,
  },
];

export default async function HomePage() {
  const user = await getSessionUser();
  const profile = user ? await getProfile() : null;

  if (user && profile) {
    const destination = profile.role === "elder" ? "/adulto" : "/cuidador/resumen";
    const label = profile.role === "elder" ? "Ir a mi portal" : "Ir al portal familiar";

    return (
      <main className="flex min-h-dvh items-center justify-center p-6">
        <div className="care-surface max-w-md px-8 py-10 text-center">
          <IconBox icon={Heart} tone="accent" size="xl" className="mx-auto mb-4" />
          <p className="text-care-muted">
            Bienvenido de nuevo, <strong className="text-care-foreground">{profile.full_name}</strong>
          </p>
          <Button asChild className="mt-6 w-full">
            <Link href={destination}>{label}</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col justify-center gap-10 p-6 lg:gap-14">
      <section className="text-center lg:text-left">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-care-accent-dark text-white shadow-lg lg:mx-0">
          <Heart className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold text-care-foreground lg:text-5xl">CareLink</h1>
        <p className="mx-auto mt-4 max-w-xl text-xl text-care-muted lg:mx-0 lg:text-2xl">
          Acompañamiento con cariño entre adultos mayores y sus familias
        </p>
        <p className="mt-3 text-care-muted-light">
          Elija el portal que corresponda a su rol para comenzar.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {PORTALS.map(({ href, title, description, icon, features, variant }) => (
          <article key={href} className="care-surface flex flex-col p-6">
            <div className="mb-4 flex items-start gap-4">
              <IconBox icon={icon} tone="accent" size="lg" />
              <div>
                <h2 className="text-xl font-bold text-care-foreground">{title}</h2>
                <p className="mt-1 text-sm text-care-muted">{description}</p>
              </div>
            </div>
            <ul className="mb-6 space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-care-muted">
                  <Check className="h-4 w-4 shrink-0 text-care-accent-dark" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button size="lg" variant={variant} asChild className="mt-auto w-full">
              <Link href={href}>Entrar</Link>
            </Button>
          </article>
        ))}
      </section>

      <p className="text-center text-sm text-care-muted">
        ¿Nuevo en CareLink?{" "}
        <Link href="/signup" className="font-semibold text-care-accent-dark underline">
          Crear cuenta
        </Link>
      </p>
    </main>
  );
}
