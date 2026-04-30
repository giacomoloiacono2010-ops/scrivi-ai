import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string,
  piano: "pro" | "team"
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${siteUrl}/dashboard?upgrade=ok`,
    cancel_url: `${siteUrl}/prezzi`,
    allow_promotion_codes: true,
    metadata: {
      userId,
      piano,
    },
  });

  return session;
}

export async function createCustomer(email: string, userId: string) {
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  });
  return customer;
}

export async function getCustomerPortal(customerId: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${siteUrl}/dashboard/account`,
  });

  return session;
}