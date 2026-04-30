import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

const features = {
  free: [
    "3 documenti gratuiti al mese",
    "Tutti i template disponibili",
    "Generazione standard",
  ],
  pro: [
    "Documenti illimitati",
    "Tutti i template disponibili",
    "Generazione prioritaria",
    "Supporto email dedicato",
    "Nessuna pubblicità",
  ],
  team: [
    "Tutto di Pro",
    "Fino a 10 membri del team",
    "Dashboard collaborativa",
    "Gestione team centralizzata",
    "Inviti multipli",
  ],
};

export default function PrezziPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] h-16">
        <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#111827]">
            ScriviAI
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/prezzi" className="text-sm font-medium text-[#111827]">
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

      <main className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-[#111827] mb-4">
              Prezzi semplici e trasparenti
            </h1>
            <p className="text-lg text-[#6B7280]">
              Scegli il piano più adatto alle tue esigenze
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#111827] mb-2">Gratuito</h2>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#111827]">0€</span>
                <span className="text-[#6B7280]">/mese</span>
              </div>
              <ul className="space-y-3 mb-8">
                {features.free.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <Check className="w-4 h-4 text-[#16A34A]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block">
                <Button variant="secondary" className="w-full">
                  Inizia gratis
                </Button>
              </Link>
            </div>

            <div className="bg-white border-2 border-[#16A34A] rounded-2xl p-8 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#16A34A] text-white text-xs font-medium px-3 py-1 rounded-full">
                Più popolare
              </div>
              <h2 className="text-xl font-bold text-[#111827] mb-2">Pro</h2>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#111827]">29€</span>
                <span className="text-[#6B7280]">/mese</span>
              </div>
              <ul className="space-y-3 mb-8">
                {features.pro.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <Check className="w-4 h-4 text-[#16A34A]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/register?piano=pro" className="block">
                <Button className="w-full">
                  Passa a Pro <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-[#6B7280]">
              Tutti i prezzi sono in euro e includono IVA.
              <br />
              Puoi disdire in qualsiasi momento.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-[#111827] py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-xl font-bold text-white">ScriviAI</span>
            <p className="text-sm text-[rgba(255,255,255,0.4)] mt-1">
              L'assistente AI per professionisti italiani
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
          <div className="text-sm text-[rgba(255,255,255,0.4)]">
            © 2026 ScriviAI
          </div>
        </div>
      </footer>
    </div>
  );
}