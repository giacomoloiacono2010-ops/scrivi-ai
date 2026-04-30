"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function formatDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setUser(user);
      setProfile(profile);
      setLoading(false);
    };
    getData();
  }, [router, supabase]);

  const handleUpgrade = async () => {
    const response = await fetch("/api/stripe/checkout", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ piano: "pro" }),
    });
    const { url } = await response.json();
    if (url) router.push(url);
  };

  if (loading) return <div className="max-w-2xl min-h-[400px] flex items-center justify-center"><div className="text-[#6B7280]">Caricamento...</div></div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">Account</h1>
        <p className="text-sm text-[#6B7280] mt-1">Gestisci le impostazioni del tuo account</p>
      </div>

      <div className="space-y-8">
        <section className="bg-white border border-[#E5E7EB] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">Il tuo piano</h2>
          {profile?.piano === "free" ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#F3F4F6] text-[#6B7280] rounded-full text-sm font-medium">Gratuito</span>
              </div>
              <p className="text-sm text-[#6B7280] mb-4">3 documenti gratuiti al mese</p>
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-4">
                <h3 className="font-medium text-[#15803D] mb-2">Passa a ScriviAI Pro</h3>
                <ul className="text-sm text-[#6B7280] mb-4 space-y-1">
                  <li>✓ Documenti illimitati</li>
                  <li>✓ Tutti i template disponibili</li>
                  <li>✓ Generazione prioritaria</li>
                  <li>✓ Supporto email dedicato</li>
                </ul>
                <Button onClick={handleUpgrade}>Passa a Pro — 29€/mese</Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${profile?.piano === "pro" ? "bg-[#16A34A] text-white" : "bg-[#3B82F6] text-white"}`}>
                  {profile?.piano === "team" ? "Team" : "Pro"}
                </span>
              </div>
              <Button variant="secondary" onClick={handleUpgrade}>Gestisci abbonamento</Button>
            </div>
          )}
        </section>

        <section className="bg-white border border-[#E5E7EB] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">Informazioni account</h2>
          <div className="space-y-4">
            <Input label="Nome" defaultValue={profile?.nome || ""} placeholder="Il tuo nome" />
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Email</label>
              <input type="email" disabled defaultValue={user?.email || ""} className="flex h-10 w-full rounded-md border border-[#E5E7EB] bg-[#F3F4F6] px-3 py-2 text-sm text-[#6B7280]" />
              <p className="mt-1 text-xs text-[#6B7280]">L'email non può essere modificata</p>
            </div>
            <p className="text-xs text-[#6B7280]">Membro dal {formatDate(profile?.created_at || new Date())}</p>
          </div>
        </section>

        <section className="bg-white border border-[#E5E7EB] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">Sicurezza</h2>
          <Button variant="secondary" onClick={() => supabase.auth.resetPasswordForEmail(user?.email || "")}>Richiedi reset password</Button>
        </section>

        <section className="bg-white border border-[#EF4444]/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#991B1B] mb-4">Zona pericolosa</h2>
          <p className="text-sm text-[#6B7280] mb-4">L'eliminazione del account è permanente e non può essere annullata.</p>
          <Button variant="danger">Elimina account</Button>
        </section>
      </div>
    </div>
  );
}