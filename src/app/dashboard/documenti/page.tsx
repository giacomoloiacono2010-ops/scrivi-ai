import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, X, Check, FileText } from "lucide-react";
import { revalidatePath } from "next/cache";

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

const tipoIcon = (tipo: string) => {
  const icons: Record<string, string> = {
    email: "📧",
    preventivo: "📋",
    reclamo: "⚠️",
    contratto: "📄",
    report: "📊",
  };
  return icons[tipo] || "📄";
};

export default async function DocumentiPage({
  searchParams,
}: {
  searchParams: { tipo?: string; page?: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const tipoFilter = searchParams.tipo;
  const page = parseInt(searchParams.page || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("documents")
    .select("*", { count: "exact" })
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (tipoFilter && tipoFilter !== "all") {
    query = query.eq("tipo", tipoFilter);
  }

  const { data: documents, count } = await query;

  const totalPages = count ? Math.ceil(count / limit) : 1;

  const handleDelete = async (documentId: string) => {
    "use server";
    const supabase = await createClient();
    await supabase.from("documents").delete().eq("id", documentId);
    revalidatePath("/dashboard/documenti");
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">I miei documenti</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Visualizza e gestisci tutti i tuoi documenti generati
        </p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "email", "preventivo", "reclamo", "contratto", "report"].map(
          (tipo) => (
            <Link
              key={tipo}
              href={`/dashboard/documenti${tipo !== "all" ? `?tipo=${tipo}` : ""}`}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                (tipoFilter === tipo || (!tipoFilter && tipo === "all"))
                  ? "bg-[#16A34A] text-white"
                  : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB]"
              }`}
            >
              {tipo === "all" ? "Tutti" : tipoLabel(tipo)}
            </Link>
          )
        )}
      </div>

      {(!documents || documents.length === 0) && (
        <div className="text-center py-16 bg-white rounded-xl border border-[#E5E7EB]">
          <FileText className="w-12 h-12 mx-auto text-[#D1D5DB] mb-4" />
          <h3 className="text-lg font-medium text-[#111827] mb-2">
            Nessun documento ancora
          </h3>
          <p className="text-sm text-[#6B7280] mb-4">
            Inizia a generare il tuo primo documento
          </p>
          <Link href="/dashboard/email">
            <Button>Genera il primo</Button>
          </Link>
        </div>
      )}

      {documents && documents.length > 0 && (
        <>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-[#E5E7EB] rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xl flex-shrink-0">
                    {tipoIcon(doc.tipo)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#111827] truncate">
                      {doc.titolo || tipoLabel(doc.tipo)}
                    </p>
                    <p className="text-xs text-[#6B7280]">
                      {formatDate(doc.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => navigator.clipboard.writeText(doc.contenuto)}
                    className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded transition-colors"
                    title="Copia"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/dashboard/documenti/${doc.id}`}
                    className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded transition-colors"
                    title="Apri"
                  >
                    <FileText className="w-4 h-4" />
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      const supabase = await createClient();
                      await supabase
                        .from("documents")
                        .delete()
                        .eq("id", doc.id);
                      revalidatePath("/dashboard/documenti");
                    }}
                  >
                    <button
                      type="submit"
                      className="p-2 text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded transition-colors"
                      title="Elimina"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/dashboard/documenti?page=${p}${tipoFilter && tipoFilter !== "all" ? `&tipo=${tipoFilter}` : ""}`}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                    p === page
                      ? "bg-[#16A34A] text-white"
                      : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB]"
                  }`}
                >
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