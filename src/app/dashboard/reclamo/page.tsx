"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TemplateForm } from "@/components/template-form";

export default function ReclamoPage() {
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
      body: JSON.stringify({ tipo: "reclamo", campi: data, titolo: `Risposta Reclamo - ${data.mittente || new Date().toLocaleDateString("it-IT")}` }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.errore || "Errore");
    return result;
  };

  if (loading) return <div className="max-w-2xl min-h-[400px] flex items-center justify-center"><div className="text-[#6B7280]">Caricamento...</div></div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">Risposta a Reclamo</h1>
        <p className="text-sm text-[#6B7280] mt-1">Genera risposte professionali ai reclami</p>
        {documentiRimasti !== Infinity && <p className="text-xs text-[#6B7280] mt-2">📝 Documenti rimasti: <strong>{documentiRimasti}</strong></p>}
      </div>
      <TemplateForm fields={[
        { name: "mittente", label: "Chi ha fatto il reclamo?", type: "text", placeholder: "Nome del cliente", required: true },
        { name: "oggetto", label: "Oggetto del reclamo", type: "text", placeholder: "Es: Ritardo consegna", required: true },
        { name: "contenuto", label: "Cosa lamentano?", type: "textarea", placeholder: "Descrivi il reclamo", required: true, minHeight: 120 },
        { name: "posizione", label: "La tua posizione", type: "select", required: true, options: [
          { value: "fondato", label: "Reclamo fondato, ci scusiamo" },
          { value: "infondato", label: "Reclamo infondato" },
          { value: "parzialmente", label: "Parzialmente fondato" },
        ]},
        { name: "azione", label: "Azione prevista", type: "textarea", placeholder: "Descrivi l'azione" },
      ]} onSubmit={handleSubmit} buttonText="Genera Risposta" />
    </div>
  );
}