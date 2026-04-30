import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateDocument, type DocumentType } from "@/lib/openai";
import { captureEvent } from "@/lib/posthog";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { errore: "Sessione scaduta. Effettua di nuovo l'accesso." },
        { status: 401 }
      );
    }

    const { tipo, campi, titolo } = await request.json();

    if (!tipo || !campi) {
      return NextResponse.json(
        { errore: "Parametri mancanti" },
        { status: 400 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { errore: "Profilo non trovato" },
        { status: 404 }
      );
    }

    const isFree = profile.piano === "free";
    const docLimit = isFree ? 3 : Infinity;
    const usedThisMonth = profile.documenti_questo_mese || 0;

    if (usedThisMonth >= docLimit) {
      return NextResponse.json(
        {
          errore:
            "Hai raggiunto il limite di 3 documenti gratuiti questo mese. Passa a Pro per continuare.",
          limiteRaggiunto: true,
        },
        { status: 403 }
      );
    }

const testo = await generateDocument(
  tipo as DocumentType,
  campi
);

    const docTypeLabel = {
      email: "Email",
      preventivo: "Preventivo",
      reclamo: "Reclamo",
      contratto: "Contratto",
      report: "Report",
    }[tipo as DocumentType];

    const { data: document, error: docError } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        tipo,
        titolo: titolo || `${docTypeLabel} - ${new Date().toLocaleDateString("it-IT")}`,
        contenuto: testo,
        campi_usati: campi,
      })
      .select()
      .single();

    if (docError) {
      console.error("Error saving document:", docError);
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        documenti_questo_mese: (usedThisMonth + 1),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
    }

    const documentiRimasti = isFree ? docLimit - usedThisMonth - 1 : Infinity;

    captureEvent("document_generated", {
      tipo,
      piano: profile.piano,
      documenti_rimasti: documentiRimasti,
    });

    return NextResponse.json({
      testo,
      documentiRimasti,
      documentoId: document?.id,
    });
  } catch (error) {
    console.error("Error generating document:", error);
    return NextResponse.json(
      { errore: "Qualcosa è andato storto. Riprova." },
      { status: 500 }
    );
  }
}