import { createClient } from "@/lib/supabase/server";
import { TemplateForm } from "@/components/template-form";

export default async function PreventivoPage() {
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
          tipo: "preventivo",
          campi: data,
          titolo: `Preventivo - ${data.cliente || new Date().toLocaleDateString("it-IT")}`,
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
        <h1 className="text-2xl font-bold text-[#111827]">Preventivo</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Crea preventivi professionali per i tuoi clienti
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
            name: "professionista",
            label: "Tua professione / Studio",
            type: "text",
            placeholder: "Es: Dott. Marco Rossi, Consulente del Lavoro",
            required: true,
          },
          {
            name: "servizio",
            label: "Servizio da preventivare",
            type: "textarea",
            placeholder:
              "Es: Consulenza e assistenza per contratto di locazione commerciale, verifica conformità normativa",
            required: true,
            minHeight: 100,
          },
          {
            name: "importo",
            label: "Importo totale (€)",
            type: "number",
            placeholder: "Es: 1500",
            required: true,
          },
          {
            name: "note",
            label: "Note aggiuntive",
            type: "textarea",
            placeholder: "Modalità di pagamento, condizioni particolari, ecc.",
          },
        ]}
        onSubmit={handleSubmit}
        buttonText="Genera Preventivo"
      />
    </div>
  );
}