import { createClient } from "@/lib/supabase/server";
import { TemplateForm } from "@/components/template-form";

export default async function ReportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const documentiRimasti =
    profile?.piano === "free"
      ? Math.max(0, 3 - (profile?.documenti_questo_mese || 0))
      : Infinity;

  const handleSubmit = async (data: Record<string, string>) => {
    "use server";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/genera`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: "report",
          campi: data,
          titolo: `Report - ${data.cliente || new Date().toLocaleDateString("it-IT")}`,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errore || "Errore nella generazione");
    }

    return result;
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">Report Cliente</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Genera report periodici professionali per i tuoi clienti
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
            name: "cliente",
            label: "Nome del cliente",
            type: "text",
            placeholder: "Es: Studio Legale Bianchi",
            required: true,
          },
          {
            name: "periodo",
            label: "Periodo di riferimento",
            type: "text",
            placeholder: "Es: Aprile 2026",
            required: true,
          },
          {
            name: "attivita",
            label: "Attività svolte nel periodo",
            type: "textarea",
            placeholder: "Descrivi le attività svolte",
            required: true,
            minHeight: 140,
          },
          {
            name: "risultati",
            label: "Risultati ottenuti",
            type: "textarea",
            placeholder: "Descrivi i risultati raggiunti",
            required: true,
          },
          {
            name: "prossimi",
            label: "Prossimi passi / Obiettivi",
            type: "textarea",
            placeholder: "Descrivi gli obiettivi per il prossimo periodo",
            required: true,
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
        ]}
        onSubmit={handleSubmit}
        buttonText="Genera Report"
      />
    </div>
  );
}