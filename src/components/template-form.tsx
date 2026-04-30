"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select } from "./ui/select";
import { RisultatoAI } from "./risultato-ai";
import { Sparkles, Loader2 } from "lucide-react";

interface Field {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "number";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  minHeight?: number;
}

interface TemplateFormProps {
  fields: Field[];
  onSubmit: (data: Record<string, string>) => Promise<{ testo: string; documentiRimasti: number }>;
  buttonText: string;
}

export function TemplateForm({ fields, onSubmit, buttonText }: TemplateFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [documentiRimasti, setDocumentiRimasti] = useState<number | null>(null);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        setError(`Il campo "${field.label}" è obbligatorio`);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await onSubmit(formData);
      setResult(response.testo);
      setDocumentiRimasti(response.documentiRimasti);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Qualcosa è andato storto. Riprova.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    await handleSubmit(new Event("submit") as unknown as React.FormEvent);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            {field.type === "textarea" ? (
              <Textarea
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                style={{ minHeight: field.minHeight || 100 }}
              />
            ) : field.type === "select" ? (
              <Select
                label={field.label}
                options={field.options || []}
                required={field.required}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            ) : field.type === "number" ? (
              <Input
                type="number"
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            ) : (
              <Input
                type="text"
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            )}
          </div>
        ))}

        {error && (
          <div className="p-3 bg-[#FEF2F2] border border-[#EF4444] rounded-md text-sm text-[#991B1B]">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generazione in corso...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {buttonText}
            </>
          )}
        </Button>
      </form>

      {result && (
        <RisultatoAI
          content={result}
          onCopy={handleCopy}
          onRegenerate={handleRegenerate}
          loading={loading}
        />
      )}
    </div>
  );
}