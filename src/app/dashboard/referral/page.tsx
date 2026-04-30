"use client";

import { Button } from "@/components/ui/button";
import { Copy, Check, Users, Gift, Star } from "lucide-react";
import { useState } from "react";

function ClientCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded transition-colors"
    >
      {copied ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

interface ReferralClientProps {
  referralCode: string;
  referralsCount: number;
  convertedCount: number;
}

function ReferralClient({ referralCode, referralsCount, convertedCount }: ReferralClientProps) {
  const referralLink = `scriviAI.it/register?ref=${referralCode}`;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">Invita amici</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Condividi ScriviAI e guadagna mesi gratis
        </p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#111827] mb-4">
          Il tuo codice referral
        </h2>

        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 flex items-center justify-between">
          <code className="text-xl font-mono font-bold text-[#111827]">
            {referralCode}
          </code>
          <ClientCopyButton text={referralCode} />
        </div>

        <div className="mt-4">
          <p className="text-sm text-[#6B7280] mb-2">Link referral:</p>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 flex items-center justify-between">
            <code className="text-sm text-[#6B7280] truncate flex-1 mr-2">
              {referralLink}
            </code>
            <ClientCopyButton text={referralLink} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 text-center">
          <Users className="w-6 h-6 mx-auto text-[#6B7280] mb-2" />
          <p className="text-2xl font-bold text-[#111827]">
            {referralsCount}
          </p>
          <p className="text-xs text-[#6B7280]">Iscritti</p>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 text-center">
          <Star className="w-6 h-6 mx-auto text-[#6B7280] mb-2" />
          <p className="text-2xl font-bold text-[#111827]">{convertedCount}</p>
          <p className="text-xs text-[#6B7280]">Convertiti</p>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 text-center">
          <Gift className="w-6 h-6 mx-auto text-[#6B7280] mb-2" />
          <p className="text-2xl font-bold text-[#111827]">
            {convertedCount}
          </p>
          <p className="text-xs text-[#6B7280]">Mesi gratis</p>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#111827] mb-4">
          Come funziona
        </h2>
        <ol className="space-y-4">
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-[#16A34A] text-white rounded-full flex items-center justify-center text-sm font-medium shrink-0">
              1
            </span>
            <div>
              <p className="text-sm font-medium text-[#111827]">
                Condividi il tuo codice
              </p>
              <p className="text-xs text-[#6B7280]">
                Invia il link ai tuoi colleghi e amici
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-[#16A34A] text-white rounded-full flex items-center justify-center text-sm font-medium shrink-0">
              2
            </span>
            <div>
              <p className="text-sm font-medium text-[#111827]">
                Si registrano gratis
              </p>
              <p className="text-xs text-[#6B7280]">
                I tuoi amici ottengono 3 documenti gratuiti
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-[#16A34A] text-white rounded-full flex items-center justify-center text-sm font-medium shrink-0">
              3
            </span>
            <div>
              <p className="text-sm font-medium text-[#111827]">
                Guadagni mesi gratis
              </p>
              <p className="text-xs text-[#6B7280]">
                Per ogni amico che passa a Pro, ottieni 1 mese gratis
              </p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ReferralPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const referralCode = profile?.referral_code || "";

  const { data: referrals } = await supabase
    .from("referrals")
    .select("*")
    .eq("referrer_id", user.id);

  const referralsCount = referrals?.length || 0;
  const convertedCount = referrals?.filter((r) => r.stato === "converted").length || 0;

  return (
    <ReferralClient
      referralCode={referralCode}
      referralsCount={referralsCount}
      convertedCount={convertedCount}
    />
  );
}