"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TemplateForm } from "@/components/template-form";

export default function EmailPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [documentiRimasti, setDocumentiRimasti] = useState(Infinity);

  useEffect(() => {
    const getData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const docRimasti =
        profile?.piano === "free"
          ? Math.max(0, 3 - (profile?.documenti_questo_mese || 0))
          : Infinity;

      setUser(user);
      setDocumentiRimasti(docRimasti);
      setLoading(false);
    };

    getData();
  }, [router, supabase]);

  const handleSubmit = async (data: Record<string, string>) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/genera`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "email",
          campi: data,
          titolo: `Email - ${data.oggetto || new Date().toLocaleDateString("it-IT")}`,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errore || "Errore nella generazione");
    }

    return result;
  };

  if (loading) {
    return (
      <div className="max-w-2xl flex items-center justify-center min-h-[400px]">
        <div className="text-[#6B7280]">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">Email Professionale</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Genera email formali e professionali in italiano
        </p>
        {documentiRimasti !== Infinity && (
          <p className="text-xs text-[#6B7280] mt-2">
            📝 Documenti rimasti questo mese: <strong>{documentiRimasti}</strong>
          </p>
        )}
      </div>

      <TemplateForm
        fields={[
          {
            name: "destinatario",
            label: "A chi scrivi?",
            type: "text",
            placeholder: "Es: Avv. Mario Rossi, Studio Legale Rossi",
            required: true,
          },
          {
            name: "oggetto",
            label: "Oggetto dell'email",
            type: "text",
            placeholder: "Es: Riscontro alla sua del 10 aprile",
            required: true,
          },
          {
            name: "contenuto",
            label: "Cosa deve comunicare l'email?",
            type: "textarea",
            placeholder:
              "Descrivi brevemente il contenuto. Es: comunicare che la pratica è completata e i documenti sono pronti per il ritiro",
            required: true,
            minHeight: 120,
          },
          {
            name: "tono",
            label: "Tono",
            type: "select",
            required: true,
            options: [
              { value: "formale", label: "Formale" },
              { value: "molto_formale", label: "Molto formale" },
              { value: "cordiale", label: "Cordiale ma professionale" },
            ],
          },
          {
            name: "lunghezza",
            label: "Lunghezza",
            type: "select",
            required: true,
            options: [
              { value: "breve", label: "Breve (3-4 righe)" },
              { value: "media", label: "Media (6-8 righe)" },
              { value: "dettagliata", label: "Dettagliata (10+ righe)" },
            ],
          },
        ]}
        onSubmit={handleSubmit}
        buttonText="Genera Email"
      />
    </div>
  );
}