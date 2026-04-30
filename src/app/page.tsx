import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, FileText, Mail, AlertTriangle, FileSignature, BarChart3 } from "lucide-react";

const testimonials = [
  {
    quote: "Scrivo 15 email formali al giorno. Con ScriviAI ci metto la metà del tempo.",
    name: "Avv. Marco R.",
    location: "Milano",
  },
  {
    quote: "Finalmente un tool in italiano che capisce il tono formale che serve nel mio lavoro.",
    name: "Dott.ssa Sara B.",
    location: "Commercialista, Roma",
  },
  {
    quote: "L'ho consigliato a tutto lo studio. I preventivi ora li generiamo in 2 minuti.",
    name: "Avv. Luca M.",
    location: "Torino",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] h-16">
        <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#111827]">
            ScriviAI
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/prezzi" className="text-sm font-medium text-[#111827] hover:text-[#16A34A]">
              Prezzi
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

      {/* Hero */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F0FDF4] border border-[#BBF7D0] rounded-full text-sm text-[#15803D] mb-6">
            ✦ Assistente AI per professionisti italiani
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#111827] tracking-tight leading-tight mb-6">
            Scrivi documenti professionali in italiano in 30 secondi
          </h1>
          <p className="text-lg text-[#6B7280] mb-8 max-w-2xl mx-auto">
            Usato da avvocati e commercialisti. Genera email formali, preventivi e
            contratti con l&apos;AI. Prova gratis, nessuna carta richiesta.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="text-base px-8 py-3">
                Inizia gratis <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-[#6B7280] mt-4">
            Nessuna carta di credito · 3 documenti gratis · Disdici quando vuoi
          </p>
        </div>
      </section>

      {/* Come funziona */}
      <section className="py-20 px-6 bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#111827] mb-12">
            Come funziona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Scegli il template",
                description: "Email, preventivo, reclamo, contratto o report. Seleziona quello che ti serve.",
              },
              {
                step: "2",
                title: "Compila i dati",
                description: "Inserisci le informazioni base: nome cliente, oggetto, contenuto.",
              },
              {
                step: "3",
                title: "Genera in 30 secondi",
                description: "L'AI crea un documento professionale pronto da usare.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-[#16A34A] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-[#111827] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#6B7280]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template disponibili */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#111827] mb-12">
            Template disponibili
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: Mail, label: "Email", desc: "Professionali" },
              { icon: FileText, label: "Preventivo", desc: "Dettagliati" },
              { icon: AlertTriangle, label: "Reclamo", desc: "Risposte" },
              { icon: FileSignature, label: "Contratto", desc: "Prestazione" },
              { icon: BarChart3, label: "Report", desc: "Clienti" },
            ].map((template) => (
              <Link
                key={template.label}
                href="/register"
                className="bg-white border border-[#E5E7EB] rounded-xl p-6 text-center hover:border-[#16A34A] hover:shadow-lg transition-all"
              >
                <template.icon className="w-8 h-8 mx-auto text-[#16A34A] mb-3" />
                <h3 className="font-semibold text-[#111827]">{template.label}</h3>
                <p className="text-xs text-[#6B7280]">{template.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonianze */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#111827] mb-12">
            Cosa dicono i nostri utenti
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-6"
              >
                <div className="w-12 h-12 bg-[#E5E7EB] rounded-full flex items-center justify-center text-xl font-bold text-[#6B7280] mb-4">
                  {t.name.charAt(0)}
                </div>
                <p className="text-sm text-[#374151] leading-relaxed mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-sm font-semibold text-[#111827]">{t.name}</p>
                <p className="text-xs text-[#6B7280]">{t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prezzi */}
      <section className="py-20 px-6 bg-[#F9FAFB]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#111827] mb-12">
            Prezzi semplici e trasparenti
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8">
              <h3 className="text-xl font-bold text-[#111827] mb-2">Gratuito</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#111827]">0€</span>
                <span className="text-[#6B7280]">/mese</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Check className="w-4 h-4 text-[#16A34A]" />
                  3 documenti/mese
                </li>
                <li className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Check className="w-4 h-4 text-[#16A34A]" />
                  Tutti i template
                </li>
              </ul>
              <Link href="/register" className="block">
                <Button variant="secondary" className="w-full">
                  Inizia gratis
                </Button>
              </Link>
            </div>
            <div className="bg-white border-2 border-[#16A34A] rounded-2xl p-8 relative shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#16A34A] text-white text-xs font-medium px-3 py-1 rounded-full">
                Più popolare
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#111827]">29€</span>
                <span className="text-[#6B7280]">/mese</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Check className="w-4 h-4 text-[#16A34A]" />
                  Documenti illimitati
                </li>
                <li className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Check className="w-4 h-4 text-[#16A34A]" />
                  Tutti i template
                </li>
                <li className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Check className="w-4 h-4 text-[#16A34A]" />
                  Generazione prioritaria
                </li>
                <li className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Check className="w-4 h-4 text-[#16A34A]" />
                  Supporto email
                </li>
              </ul>
              <Link href="/register?piano=pro" className="block">
                <Button className="w-full">
                  Passa a Pro <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111827] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-xl font-bold text-white">ScriviAI</span>
            <p className="text-sm text-[rgba(255,255,255,0.4)] mt-1">
              L&apos;assistente AI per professionisti italiani
            </p>
          </div>
          <div className="flex gap-6 text-sm text-[rgba(255,255,255,0.4)]">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/termini" className="hover:text-white">
              Termini di servizio
            </Link>
          </div>
          <div className="text-sm text-[rgba(255,255,255,0.4)]">© 2026 ScriviAI</div>
        </div>
      </footer>
    </div>
  );
}