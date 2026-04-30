import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { sendPaymentFailedEmail } from "@/lib/emails";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { errore: "Signature mancante" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { errore: "Signature non valida" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const piano = session.metadata?.piano || "pro";

      if (userId) {
        await supabase
          .from("profiles")
          .update({
            piano,
            stripe_subscription_id: session.subscription as string,
          })
          .eq("id", userId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profile) {
        const newPiano = subscription.status === "active" ? "pro" : "free";
        await supabase
          .from("profiles")
          .update({ piano: newPiano })
          .eq("id", profile.id);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({ piano: "free", stripe_subscription_id: null })
          .eq("id", profile.id);
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profile?.email) {
        await sendPaymentFailedEmail(profile.email, profile.nome || "");
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}