import { createClient } from "@/lib/supabase/server";
import { TemplateForm } from "@/components/template-form";

export default async function ContrattoPage() {
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
          tipo: "contratto",
          campi: data,
          titolo: `Contratto - ${data.cliente || new Date().toLocaleDateString("it-IT")}`,
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
        <h1 className="text-2xl font-bold text-[#111827]">Contratto Base</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Redigi contratti di prestazione professionale
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
            name: "professionista",
            label: "Tuo nome / Studio professionale",
            type: "text",
            placeholder: "Es: Dott. Marco Rossi",
            required: true,
          },
          {
            name: "cliente",
            label: "Nome del cliente",
            type: "text",
            placeholder: "Es: Studio Beta Srl",
            required: true,
          },
          {
            name: "servizio",
            label: "Servizio oggetto del contratto",
            type: "textarea",
            placeholder: "Descrivi il servizio che verrà erogato",
            required: true,
            minHeight: 100,
          },
          {
            name: "compenso",
            label: "Compenso pattuito (€)",
            type: "number",
            placeholder: "Es: 2500",
            required: true,
          },
          {
            name: "durata",
            label: "Durata o data di scadenza",
            type: "text",
            placeholder: "Es: 6 mesi oppure 31 dicembre 2026",
            required: true,
          },
          {
            name: "pagamento",
            label: "Modalità di pagamento",
            type: "text",
            placeholder: "Es: 50% all'avvio, saldo alla consegna",
            required: true,
          },
        ]}
        onSubmit={handleSubmit}
        buttonText="Genera Contratto"
      />
    </div>
  );
}