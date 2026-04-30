"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface BannerLimiteProps {
  documentiRimasti: number;
}

export function BannerLimite({ documentiRimasti }: BannerLimiteProps) {
  if (documentiRimasti > 0) return null;

  return (
    <div className="bg-[#FEF9C3] border border-[#FDE047] rounded-lg p-4 flex items-center gap-3 mb-6">
      <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#854D0E]" />
      <p className="text-sm text-[#854D0E]">
        Hai usato i tuoi 3 documenti gratuiti questo mese.
      </p>
      <Link
        href="/prezzi"
        className="text-sm font-semibold text-[#16A34A] hover:underline ml-auto shrink-0"
      >
        Passa a Pro →
      </Link>
    </div>
  );
}