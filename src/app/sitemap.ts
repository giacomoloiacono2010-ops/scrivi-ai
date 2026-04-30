import { MetadataRoute } from "next";

const tools = [
  "genera-email-professionale-gratis",
  "modello-preventivo-avvocato",
  "risposta-reclamo-cliente-modello",
  "contratto-prestazione-professionale-modello",
  "email-sollecito-pagamento-professionale",
  "lettera-formale-commercialista",
  "email-conferma-appuntamento-studio",
  "modello-email-cliente-moroso",
  "generatore-contratto-consulenza",
  "email-fine-mandato-avvocato",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://scriviAI.it";

  const staticPages = [
    "",
    "/prezzi",
    "/login",
    "/register",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const toolPages = tools.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...toolPages];
}