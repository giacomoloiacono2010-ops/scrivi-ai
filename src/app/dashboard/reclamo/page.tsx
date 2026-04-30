import { createClient } from "@/lib/supabase/server";
import { TemplateForm } from "@/components/template-form";

export default async function ReclamoPage() {
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
          tipo: "reclamo",
          campi: data,
          titolo: `Risposta Reclamo - ${data.mittente || new Date().toLocaleDateString("it-IT")}`,
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
        <h1 className="text-2xl font-bold text-[#111827]">Risposta a Reclamo</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Genera risposte professionali ai reclami dei clienti
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
            name: "mittente",
            label: "Chi ha fatto il reclamo?",
            type: "text",
            placeholder: "Nome del cliente o azienda",
            required: true,
          },
          {
            name: "oggetto",
            label: "Oggetto del reclamo",
            type: "text",
            placeholder: "Es: Ritardo nella consegna della pratica",
            required: true,
          },
          {
            name: "contenuto",
            label: "Cosa lamentano?",
            type: "textarea",
            placeholder: "Descrivi il contenuto del reclamo ricevuto",
            required: true,
            minHeight: 120,
          },
          {
            name: "posizione",
            label: "La tua posizione",
            type: "select",
            required: true,
            options: [
              { value: "fondato", label: "Il reclamo è fondato, ci scusiamo" },
              { value: "infondato", label: "Il reclamo è infondato, ci difendiamo" },
              { value: "parzialmente", label: "Il reclamo è parzialmente fondato" },
            ],
          },
          {
            name: "azione",
            label: "Azione che intendi intraprendere",
            type: "textarea",
            placeholder: "Descrivi l'azione che porterai avanti",
          },
        ]}
        onSubmit={handleSubmit}
        buttonText="Genera Risposta"
      />
    </div>
  );
}