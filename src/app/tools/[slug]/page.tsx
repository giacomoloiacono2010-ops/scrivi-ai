import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TemplateForm } from "@/components/template-form";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const tools = [
  {
    slug: "genera-email-professionale-gratis",
    tipo: "email",
    title: "Generatore email professionale italiano",
    description:
      "Genera email formali e professionali in italiano. Perfetto per avvocati, commercialisti e consulenti.",
    keywords:
      "generatore email professionale italiano, email formale avvocato, email commercialista",
    fields: [
      { name: "destinatario", label: "A chi scrivi?", type: "text" as const, placeholder: "Es: Avv. Mario Rossi", required: true },
      { name: "oggetto", label: "Oggetto", type: "text" as const, required: true },
      { name: "contenuto", label: "Cosa deve comunicare?", type: "textarea" as const, required: true, minHeight: 120 },
      { name: "tono", label: "Tono", type: "select" as const, required: true, options: [
        { value: "formale", label: "Formale" },
        { value: "cordiale", label: "Cordiale ma professionale" },
      ]},
      { name: "lunghezza", label: "Lunghezza", type: "select" as const, required: true, options: [
        { value: "breve", label: "Breve" },
        { value: "media", label: "Media" },
        { value: "dettagliata", label: "Dettagliata" },
      ]},
    ],
  },
  {
    slug: "modello-preventivo-avvocato",
    tipo: "preventivo",
    title: "Modello preventivo avvocato",
    description:
      "Crea preventivi professionali per i tuoi servizi legali. Template gratuito per avvocati.",
    keywords: "modello preventivo avvocato, preventivo studio legale, preventivo consulenza legale",
    fields: [
      { name: "cliente", label: "Nome cliente", type: "text" as const, required: true },
      { name: "professionista", label: "Tuo nome/studio", type: "text" as const, required: true },
      { name: "servizio", label: "Servizio", type: "textarea" as const, required: true },
      { name: "importo", label: "Importo (€)", type: "number" as const, required: true },
      { name: "note", label: "Note", type: "textarea" as const },
    ],
  },
  {
    slug: "risposta-reclamo-cliente-modello",
    tipo: "reclamo",
    title: "Risposta reclamo cliente - Modello",
    description:
      "Genera risposte professionali ai reclami dei clienti. Mantieni un tono formale e risolutivo.",
    keywords: "risposta reclamo cliente, modello risposta reclamo, gestione reclami",
    fields: [
      { name: "mittente", label: "Chi ha reclamato?", type: "text" as const, required: true },
      { name: "oggetto", label: "Oggetto", type: "text" as const, required: true },
      { name: "contenuto", label: "Contenuto del reclamo", type: "textarea" as const, required: true, minHeight: 120 },
      { name: "posizione", label: "La tua posizione", type: "select" as const, required: true, options: [
        { value: "fondato", label: "Reclamo fondato, ci scusiamo" },
        { value: "infondato", label: "Reclamo infondato" },
        { value: "parzialmente", label: "Parzialmente fondato" },
      ]},
      { name: "azione", label: "Azione prevista", type: "textarea" as const },
    ],
  },
  {
    slug: "contratto-prestazione-professionale-modello",
    tipo: "contratto",
    title: "Contratto prestazione professionale",
    description:
      "Genera contratti di prestazione professionale in italiano. Include tutte le clausole necessarie.",
    keywords: "contratto prestazione professionale, modello contratto consulenza, contratto lavoro",
    fields: [
      { name: "professionista", label: "Professionista", type: "text" as const, required: true },
      { name: "cliente", label: "Cliente", type: "text" as const, required: true },
      { name: "servizio", label: "Servizio", type: "textarea" as const, required: true },
      { name: "compenso", label: "Compenso (€)", type: "number" as const, required: true },
      { name: "durata", label: "Durata", type: "text" as const, required: true },
      { name: "pagamento", label: "Modalità pagamento", type: "text" as const, required: true },
    ],
  },
  {
    slug: "email-sollecito-pagamento-professionale",
    tipo: "email",
    title: "Email sollecito pagamento professionale",
    description:
      "Genera email di sollecito pagamento professionali e rispettose. Per professionisti italiani.",
    keywords: "email sollecito pagamento, sollecito fattura, sollecito pagamento cliente",
    fields: [
      { name: "destinatario", label: "A chi scrivi?", type: "text" as const, required: true },
      { name: "oggetto", label: "Oggetto", type: "text" as const, required: true },
      { name: "contenuto", label: "Dettagli del sollecito", type: "textarea" as const, required: true },
      { name: "tono", label: "Tono", type: "select" as const, required: true, options: [
        { value: "formale", label: "Formale" },
        { value: "cordiale", label: "Gentile ma fermo" },
      ]},
      { name: "lunghezza", label: "Lunghezza", type: "select" as const, required: true, options: [
        { value: "breve", label: "Breve" },
        { value: "media", label: "Media" },
      ]},
    ],
  },
];

export async function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) {
    return { title: "Strumento non trovato - ScriviAI" };
  }

  return {
    title: `${tool.title} — Gratis | ScriviAI`,
    description: tool.description,
    keywords: tool.keywords,
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#111827] mb-2">
            Strumento non trovato
          </h1>
          <p className="text-[#6B7280] mb-4">
            Lo strumento che cerchi non esiste.
          </p>
          <Link href="/">
            <Button>Torna alla home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: Record<string, string>) => {
    "use server";
    // For SEO tools without auth, we'll redirect to register
    // In production, you'd handle this differently
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/genera`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: tool.tipo,
          campi: data,
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
    <div className="min-h-screen bg-[#FAFAF8]">
      <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] h-16">
        <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#111827]">
            ScriviAI
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/prezzi">
              <Button variant="ghost" size="sm">
                Prezzi
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Accedi
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Inizia gratis</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">{tool.title}</h1>
          <p className="text-[#6B7280]">{tool.description}</p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
          <TemplateForm
            fields={tool.fields}
            onSubmit={handleSubmit}
            buttonText="Genera documento"
          />
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">
            Domande frequenti
          </h2>
          <div className="space-y-4">
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
              <h3 className="font-medium text-[#111827] mb-2">
                È gratuito?
              </h3>
              <p className="text-sm text-[#6B7280]">
                Puoi generare 3 documenti gratuiti al mese. Per documenti illimitati,
                passa a Pro a 29€/mese.
              </p>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
              <h3 className="font-medium text-[#111827] mb-2">
                I documenti sono validi legalmente?
              </h3>
              <p className="text-sm text-[#6B7280]">
                I documenti generati sono template professionali. Per questioni legali
                specifiche, consulta sempre un professionista.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-6 text-center">
          <h3 className="font-semibold text-[#15803D] mb-2">
            Sblocca documenti illimitati
          </h3>
          <p className="text-sm text-[#6B7280] mb-4">
            Con ScriviAI Pro hai documenti illimitati, generazione prioritaria e supporto dedicato.
          </p>
          <Link href="/prezzi">
            <Button>
              Passa a Pro — 29€/mese{" "}
              <span className="ml-1 text-xs opacity-80">(disdici quando vuoi)</span>
            </Button>
          </Link>
        </div>
      </main>

      <footer className="bg-[#111827] py-8 px-6 mt-20">
        <div className="max-w-6xl mx-auto text-center text-sm text-[rgba(255,255,255,0.4)]">
          © 2026 ScriviAI — L&apos;assistente AI per professionisti italiani
        </div>
      </footer>
    </div>
  );
}