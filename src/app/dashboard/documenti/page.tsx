"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, FileText } from "lucide-react";

const tipoLabel = (tipo: string) => {
  const labels: Record<string, string> = { email: "Email", preventivo: "Preventivo", reclamo: "Reclamo", contratto: "Contratto", report: "Report" };
  return labels[tipo] || tipo;
};

const tipoIcon = (tipo: string) => {
  const icons: Record<string, string> = { email: "📧", preventivo: "📋", reclamo: "⚠️", contratto: "📄", report: "📊" };
  return icons[tipo] || "📄";
};

function formatDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function DocumentiPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const tipoFilter = searchParams.get("tipo") || "all";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      let query = supabase.from("documents").select("*", { count: "exact" }).eq("user_id", user.id).order("created_at", { ascending: false }).range(offset, offset + limit - 1);
      if (tipoFilter && tipoFilter !== "all") query = query.eq("tipo", tipoFilter);

      const { data: docs, count } = await query;
      setDocuments(docs || []);
      setTotalPages(count ? Math.ceil(count / limit) : 1);
      setLoading(false);
    };
    getData();
  }, [router, supabase, tipoFilter, page, offset, limit]);

  const handleDelete = async (docId: string) => {
    await supabase.from("documents").delete().eq("id", docId);
    setDocuments(documents.filter(d => d.id !== docId));
  };

  if (loading) return <div className="max-w-4xl min-h-[400px] flex items-center justify-center"><div className="text-[#6B7280]">Caricamento...</div></div>;

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">I miei documenti</h1>
        <p className="text-sm text-[#6B7280] mt-1">Visualizza e gestisci tutti i tuoi documenti generati</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "email", "preventivo", "reclamo", "contratto", "report"].map((tipo) => (
          <Link key={tipo} href={`/dashboard/documenti${tipo !== "all" ? `?tipo=${tipo}` : ""}`}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${(tipoFilter === tipo || (!tipoFilter && tipo === "all")) ? "bg-[#16A34A] text-white" : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB]"}`}>
            {tipo === "all" ? "Tutti" : tipoLabel(tipo)}
          </Link>
        ))}
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#E5E7EB]">
          <FileText className="w-12 h-12 mx-auto text-[#D1D5DB] mb-4" />
          <h3 className="text-lg font-medium text-[#111827] mb-2">Nessun documento ancora</h3>
          <p className="text-sm text-[#6B7280] mb-4">Inizia a generare il tuo primo documento</p>
          <Link href="/dashboard/email"><Button>Genera il primo</Button></Link>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white border border-[#E5E7EB] rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xl flex-shrink-0">{tipoIcon(doc.tipo)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#111827] truncate">{doc.titolo || tipoLabel(doc.tipo)}</p>
                    <p className="text-xs text-[#6B7280]">{formatDate(doc.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => navigator.clipboard.writeText(doc.contenuto)} className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded transition-colors" title="Copia">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(doc.id)} className="p-2 text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded transition-colors" title="Elimina">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link key={p} href={`/dashboard/documenti?page=${p}${tipoFilter && tipoFilter !== "all" ? `&tipo=${tipoFilter}` : ""}`}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm ${p === page ? "bg-[#16A34A] text-white" : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB]"}`}>
                  {p}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}