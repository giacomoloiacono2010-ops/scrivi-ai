import OpenAI from "openai";

function getOpenAIClient() {
  return new OpenAI({
    baseURL: process.env.OPENAI_BASE_URL || "https://integrate.api.nvidia.com/v1",
    apiKey: process.env.OPENAI_API_KEY || "",
    defaultHeaders: {
      "NVIDIA-API-Key": process.env.OPENAI_API_KEY || "",
    },
  });
}

export const MODEL = process.env.OPENAI_MODEL || "nvidia/nemotron-70b";

export const SYSTEM_PROMPT = `Sei un assistente legale e professionale italiano. Scrivi documenti formali, corretti e professionali in italiano. Rispondi SOLO con il documento richiesto. Non aggiungere introduzioni, spiegazioni, commenti o note. Non usare markdown. Usa solo testo normale con ritorni a capo dove appropriato.`;

export type DocumentType = "email" | "preventivo" | "reclamo" | "contratto" | "report";

interface EmailFields { destinatario: string; oggetto: string; contenuto: string; tono: string; lunghezza: string; }
interface PreventivoFields { cliente: string; professionista: string; servizio: string; importo: string; note: string; }
interface ReclamoFields { mittente: string; oggetto: string; contenuto: string; posizione: string; azione: string; }
interface ContrattoFields { professionista: string; cliente: string; servizio: string; compenso: string; durata: string; pagamento: string; }
interface ReportFields { cliente: string; periodo: string; attivita: string; risultati: string; prossimi: string; tono: string; }
type DocumentFields = EmailFields | PreventivoFields | ReclamoFields | ContrattoFields | ReportFields;

function buildPrompt(tipo: DocumentType, fields: DocumentFields): string {
  switch (tipo) {
    case "email": {
      const f = fields as EmailFields;
      return `Scrivi un'email professionale in italiano con queste caratteristiche:
- Destinatario: ${f.destinatario}
- Oggetto: ${f.oggetto}
- Contenuto da comunicare: ${f.contenuto}
- Tono richiesto: ${f.tono}
- Lunghezza: ${f.lunghezza}
Inizia con "Gentile ${f.destinatario}," e termina con "Cordiali saluti," seguito da uno spazio per la firma.`;
    }
    case "preventivo": {
      const f = fields as PreventivoFields;
      return `Scrivi un preventivo professionale in italiano per:
- Cliente: ${f.cliente}
- Professionista/Studio: ${f.professionista}
- Servizio: ${f.servizio}
- Importo totale: ${f.importo}€
- Note aggiuntive: ${f.note}
Includi: intestazione con data, descrizione dettagliata del servizio, importo, modalità di pagamento standard, validità del preventivo (30 giorni), e spazio per la firma.`;
    }
    case "reclamo": {
      const f = fields as ReclamoFields;
      return `Scrivi una risposta professionale a un reclamo in italiano:
- Mittente reclamo: ${f.mittente}
- Oggetto del reclamo: ${f.oggetto}
- Contenuto del reclamo: ${f.contenuto}
- Posizione: ${f.posizione}
- Azione prevista: ${f.azione}
La risposta deve essere formale, equilibrata e risolutiva.`;
    }
    case "contratto": {
      const f = fields as ContrattoFields;
      return `Scrivi un contratto di prestazione professionale in italiano tra:
- Professionista: ${f.professionista}
- Cliente: ${f.cliente}
- Servizio: ${f.servizio}
- Compenso: ${f.compenso}€
- Durata: ${f.durata}
- Modalità di pagamento: ${f.pagamento}
Includi: oggetto del contratto, obblighi delle parti, compenso e pagamento, durata, riservatezza, risoluzione anticipata, foro competente (Italia).`;
    }
    case "report": {
      const f = fields as ReportFields;
      return `Scrivi un report professionale per il cliente in italiano:
- Cliente: ${f.cliente}
- Periodo: ${f.periodo}
- Attività svolte: ${f.attivita}
- Risultati ottenuti: ${f.risultati}
- Prossimi passi: ${f.prossimi}
- Tono: ${f.tono}
Struttura il report con sezioni chiare: Sommario, Attività del Periodo, Risultati, Prossimi Obiettivi.`;
    }
    default: return "";
  }
}

export async function generateDocument(tipo: DocumentType, fields: DocumentFields): Promise<string> {
  const client = getOpenAIClient();
  const userPrompt = buildPrompt(tipo, fields);

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4096,
  });

  return response.choices[0]?.message?.content || "";
}