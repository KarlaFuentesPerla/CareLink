"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { signUp } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBox } from "@/components/ui/icon-box";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await signUp(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center care-gradient-page p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <IconBox icon={UserPlus} tone="accent" size="xl" className="mx-auto mb-3" />
          <CardTitle className="text-3xl">Crear cuenta</CardTitle>
          <p className="text-care-muted">Únete a CareLink</p>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-care-foreground">
                Nombre completo
              </label>
              <input
                name="fullName"
                required
                className="care-input"
                placeholder="Ana García"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-care-foreground">
                Correo
              </label>
              <input name="email" type="email" required className="care-input" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-care-foreground">
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="care-input"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-care-foreground">
                Tipo de cuenta
              </label>
              <select name="role" className="care-input">
                <option value="caregiver">Familiar / Cuidador</option>
                <option value="elder">Adulto mayor</option>
              </select>
            </div>
            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>
            )}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Creando..." : "Crear cuenta"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-care-muted">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-semibold text-care-accent-dark underline">
              Iniciar sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
