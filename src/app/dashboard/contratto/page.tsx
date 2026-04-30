"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TemplateForm } from "@/components/template-form";

export default function ContrattoPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [documentiRimasti, setDocumentiRimasti] = useState(Infinity);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      const docRimasti = profile?.piano === "free" ? Math.max(0, 3 - (profile?.documenti_questo_mese || 0)) : Infinity;
      setDocumentiRimasti(docRimasti);
      setLoading(false);
    };
    getData();
  }, [router, supabase]);

  const handleSubmit = async (data: Record<string, string>) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/genera`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "contratto", campi: data, titolo: `Contratto - ${data.cliente || new Date().toLocaleDateString("it-IT")}` }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.errore || "Errore");
    return result;
  };

  if (loading) return <div className="max-w-2xl min-h-[400px] flex items-center justify-center"><div className="text-[#6B7280]">Caricamento...</div></div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">Contratto Base</h1>
        <p className="text-sm text-[#6B7280] mt-1">Redigi contratti di prestazione professionale</p>
        {documentiRimasti !== Infinity && <p className="text-xs text-[#6B7280] mt-2">📝 Documenti rimasti: <strong>{documentiRimasti}</strong></p>}
      </div>
      <TemplateForm fields={[
        { name: "professionista", label: "Tuo nome / Studio", type: "text", placeholder: "Es: Dott. Marco Rossi", required: true },
        { name: "cliente", label: "Nome del cliente", type: "text", placeholder: "Es: Studio Beta Srl", required: true },
        { name: "servizio", label: "Servizio", type: "textarea", placeholder: "Descrivi il servizio", required: true, minHeight: 100 },
        { name: "compenso", label: "Compenso (€)", type: "number", placeholder: "Es: 2500", required: true },
        { name: "durata", label: "Durata", type: "text", placeholder: "Es: 6 mesi", required: true },
        { name: "pagamento", label: "Modalità pagamento", type: "text", placeholder: "Es: 50% avanti, saldo consegna", required: true },
      ]} onSubmit={handleSubmit} buttonText="Genera Contratto" />
    </div>
  );
}