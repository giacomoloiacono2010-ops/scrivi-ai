"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Copy, RotateCcw, Check } from "lucide-react";

interface RisultatoAIProps {
  content: string;
  onCopy: () => void;
  onRegenerate: () => void;
  loading?: boolean;
}

export function RisultatoAI({ content, onCopy, onRegenerate, loading }: RisultatoAIProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#F9FAFB] border border-[#E5E7EB] border-l-4 border-l-[#16A34A] rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-[#374151]">Documento generato</span>
        <span className="px-2 py-0.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded text-[10px] font-medium text-[#15803D]">
          AI
        </span>
      </div>
      
      <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
        {content}
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-[#E5E7EB]">
        <Button variant="primary" size="sm" onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copiato!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copia testo
            </>
          )}
        </Button>
        <Button variant="secondary" size="sm" onClick={onRegenerate} disabled={loading}>
          <RotateCcw className="w-3.5 h-3.5" />
          Rigenera
        </Button>
      </div>
    </div>
  );
}