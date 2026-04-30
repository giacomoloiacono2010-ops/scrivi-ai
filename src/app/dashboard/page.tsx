import { createClient } from "@/lib/supabase/server";
import { getGreeting, formatDate } from "@/lib/utils";
import { BannerLimite } from "@/components/banner-limite";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  FileText,
  AlertTriangle,
  FileSignature,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const templates = [
  {
    href: "/dashboard/email",
    title: "Email Professionale",
    description: "Comunica in modo formale e professionale",
    icon: Mail,
  },
  {
    href: "/dashboard/preventivo",
    title: "Preventivo",
    description: "Crea preventivi dettagliati per i tuoi clienti",
    icon: FileText,
  },
  {
    href: "/dashboard/reclamo",
    title: "Risposta a Reclamo",
    description: "Rispondi ai reclami in modo professionale",
    icon: AlertTriangle,
  },
  {
    href: "/dashboard/contratto",
    title: "Contratto Base",
    description: "Redigi contratti di prestazione professionale",
    icon: FileSignature,
  },
  {
    href: "/dashboard/report",
    title: "Report Cliente",
    description: "Genera report periodici per i tuoi clienti",
    icon: BarChart3,
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const { data: recentDocuments } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const documentiRimasti =
    profile?.piano === "free"
      ? Math.max(0, 3 - (profile?.documenti_questo_mese || 0))
      : Infinity;

  const tipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      email: "Email",
      preventivo: "Preventivo",
      reclamo: "Reclamo",
      contratto: "Contratto",
      report: "Report",
    };
    return labels[tipo] || tipo;
  };

  return (
    <div className="max-w-4xl">
      <BannerLimite documentiRimasti={documentiRimasti} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">
          {getGreeting()}, {profile?.nome || "utente"}!
        </h1>
        <p className="text-sm text-[#6B7280] mt-1">
          {formatDate(new Date())} — Cosa vuoi generare oggi?
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#111827] mb-4">
          Template disponibili
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {templates.map((template) => (
            <Link key={template.href} href={template.href}>
              <Card className="h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#F0FDF4] rounded-lg flex items-center justify-center flex-shrink-0">
                      <template.icon className="w-5 h-5 text-[#16A34A]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#111827] text-sm">
                        {template.title}
                      </h3>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {recentDocuments && recentDocuments.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#111827]">
              Documenti recenti
            </h2>
            <Link
              href="/dashboard/documenti"
              className="text-sm text-[#16A34A] hover:underline flex items-center gap-1"
            >
              Vedi tutti <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-[#E5E7EB] rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {doc.tipo === "email"
                      ? "📧"
                      : doc.tipo === "preventivo"
                      ? "📋"
                      : doc.tipo === "reclamo"
                      ? "⚠️"
                      : doc.tipo === "contratto"
                      ? "📄"
                      : "📊"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[#111827]">
                      {tipoLabel(doc.tipo)}
                    </p>
                    <p className="text-xs text-[#6B7280]">
                      {formatDate(doc.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}