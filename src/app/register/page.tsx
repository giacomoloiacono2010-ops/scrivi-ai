"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const getPasswordStrength = (pwd: string): { level: number; label: string } => {
    if (pwd.length === 0) return { level: 0, label: "" };
    if (pwd.length < 6) return { level: 1, label: "Debole" };
    if (pwd.length < 8) return { level: 2, label: "Media" };
    return { level: 3, label: "Forte" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!acceptedTerms) {
      setError("Devi accettare i Termini di servizio e la Privacy Policy");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("La password deve essere di almeno 8 caratteri");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/login?registered=true");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#111827]">
            ScriviAI
          </Link>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#111827] mb-1">Crea il tuo account</h1>
          <p className="text-sm text-[#6B7280] mb-6">
            Inizia a generare documenti professionali in 30 secondi
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Nome completo"
              placeholder="Mario Rossi"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <Input
              type="email"
              label="Email"
              placeholder="tua@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Minimo 8 caratteri"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-[#6B7280] hover:text-[#374151]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#16A34A] transition-all"
                      style={{
                        width: `${(passwordStrength.level / 3) * 100}%`,
                      }}
                    />
                  </div>
                  <span
                    className={`text-xs ${
                      passwordStrength.level === 3
                        ? "text-[#16A34A]"
                        : passwordStrength.level === 2
                        ? "text-[#F59E0B]"
                        : "text-[#EF4444]"
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#E5E7EB] text-[#16A34A] focus:ring-[#16A34A]"
              />
              <span className="text-sm text-[#6B7280]">
                Accetto i{" "}
                <Link href="/termini" className="text-[#16A34A] hover:underline">
                  Termini di servizio
                </Link>{" "}
                e la{" "}
                <Link href="/privacy" className="text-[#16A34A] hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {error && (
              <div className="p-3 bg-[#FEF2F2] border border-[#EF4444] rounded-md text-sm text-[#991B1B]">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Crea account
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E5E7EB] text-center">
            <p className="text-sm text-[#6B7280]">
              Hai già un account?{" "}
              <Link href="/login" className="text-[#16A34A] hover:underline font-medium">
                Accedi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}