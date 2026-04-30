import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession, createCustomer } from "@/lib/stripe";
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
        { errore: "Sessione scaduta" },
        { status: 401 }
      );
    }

    const { piano } = await request.json();

    if (piano !== "pro" && piano !== "team") {
      return NextResponse.json(
        { errore: "Piano non valido" },
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

    let customerId = profile.stripe_customer_id;

    if (!customerId) {
      const customer = await createCustomer(user.email || "", user.id);
      customerId = customer.id;

      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const priceId =
      piano === "pro"
        ? process.env.STRIPE_PRICE_ID_PRO
        : process.env.STRIPE_PRICE_ID_TEAM;

    if (!priceId) {
      return NextResponse.json(
        { errore: "Configurazione Stripe mancante" },
        { status: 500 }
      );
    }

    const session = await createCheckoutSession(
      customerId,
      priceId,
      user.id,
      piano
    );

    captureEvent("upgrade_clicked", { piano, source: "dashboard" });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { errore: "Errore durante la creazione del checkout" },
      { status: 500 }
    );
  }
}