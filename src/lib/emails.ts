import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@scriviAI.it";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const emailStyles = `
  <style>
    body { font-family: 'Segoe UI', system-ui, sans-serif; line-height: 1.6; color: #111827; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .btn { display: inline-block; padding: 12px 24px; background: #16A34A; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 12px; }
  </style>
`;

export async function sendWelcomeEmail(email: string, nome: string) {
  return resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Benvenuto in ScriviAI 👋",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${emailStyles}
      </head>
      <body>
        <div class="container">
          <h1>Ciao ${nome}! 👋</h1>
          <p>Benvenuto in <strong>ScriviAI</strong>, l'assistente AI che ti aiuta a scrivere documenti professionali in italiano in pochi secondi.</p>
          
          <h2>Cosa puoi fare con ScriviAI:</h2>
          <ul>
            <li>📧 Generare email professionali</li>
            <li>📋 Creare preventivi dettagliati</li>
            <li>⚖️ Rispondere ai reclami</li>
            <li>📄 Redigere contratti</li>
            <li>📊 Scrivere report per i tuoi clienti</li>
          </ul>
          
          <p style="margin-top: 24px;">
            <a href="${siteUrl}/dashboard/email" class="btn">Genera il tuo primo documento</a>
          </p>
          
          <p>Hai a disposizione <strong>3 documenti gratuiti</strong> questo mese per provare il servizio.</p>
          
          <div class="footer">
            <p>Il team di ScriviAI</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendReminderEmail(email: string, nome: string) {
  return resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "I tuoi 3 documenti gratuiti ti aspettano",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${emailStyles}
      </head>
      <body>
        <div class="container">
          <h1>Ciao ${nome}! 👋</h1>
          <p>Volevamo ricordarti che hai ancora i tuoi <strong>3 documenti gratuiti</strong> da utilizzare questo mese.</p>
          
          <h2>Esempi di cosa puoi generare:</h2>
          <ul>
            <li>Email formali per comunicare con clienti e colleghi</li>
            <li>Preventivi professionali per i tuoi servizi</li>
            <li>Risposte ai reclami dei clienti</li>
            <li>Contratti di prestazione professionale</li>
          </ul>
          
          <p style="margin-top: 24px;">
            <a href="${siteUrl}/dashboard" class="btn">Inizia ora</a>
          </p>
          
          <div class="footer">
            <p>Il team di ScriviAI</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendFirstDocEmail(email: string, nome: string, docType: string) {
  return resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Hai appena risparmiato 15 minuti ⏱",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${emailStyles}
      </head>
      <body>
        <div class="container">
          <h1>Complimenti ${nome}! 🎉</h1>
          <p>Hai appena generato il tuo primo <strong>${docType}</strong> con ScriviAI.</p>
          
          <p>Il documento è stato salvato nella tua dashboard e puoi copiarlo o modificarlo in qualsiasi momento.</p>
          
          <h2>Vantaggi di ScriviAI Pro:</h2>
          <ul>
            <li>✅ Documenti illimitati</li>
            <li>✅ Tutti i template disponibili</li>
            <li>✅ Generazione prioritaria</li>
            <li>✅ Supporto email dedicato</li>
          </ul>
          
          <p style="margin-top: 24px;">
            <a href="${siteUrl}/prezzi" class="btn">Passa a Pro — 29€/mese</a>
          </p>
          
          <div class="footer">
            <p>Il team di ScriviAI</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendTrialEndingEmail(email: string, nome: string) {
  return resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Stai usando ScriviAI al massimo?",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${emailStyles}
      </head>
      <body>
        <div class="container">
          <h1>Ciao ${nome},</h1>
          <p>Abbiamo notato che stai usando attivamente ScriviAI e vogliamo assicurarci che tu stia sfruttando al massimo il servizio.</p>
          
          <h2>Con ScriviAI Pro puoi:</h2>
          <ul>
            <li>📝 Generare documenti <strong>illimitati</strong></li>
            <li>⚡ Ottenere risposte più veloci</li>
            <li>🎯 Accedere a tutti i template</li>
            <li>💬 Ricevere supporto prioritario</li>
          </ul>
          
          <p style="margin-top: 24px;">
            <a href="${siteUrl}/prezzi" class="btn">Passa a Pro — 29€/mese</a>
          </p>
          
          <p style="color: #6B7280; font-size: 12px; margin-top: 20px;">
            Puoi disdire in qualsiasi momento. Nessun compromiso!
          </p>
          
          <div class="footer">
            <p>Il team di ScriviAI</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendPaymentFailedEmail(email: string, nome: string) {
  return resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Problema con il tuo abbonamento ScriviAI",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${emailStyles}
      </head>
      <body>
        <div class="container">
          <h1>Ciao ${nome},</h1>
          <p>Abbiamo riscontrato un problema con il pagamento del tuo abbonamento ScriviAI.</p>
          
          <p>Per continuare a utilizzare il servizio senza interruzioni, ti invitiamo ad aggiornare il tuo metodo di pagamento.</p>
          
          <p style="margin-top: 24px;">
            <a href="${siteUrl}/dashboard/account" class="btn">Aggiorna metodo di pagamento</a>
          </p>
          
          <p style="color: #6B7280; font-size: 12px; margin-top: 20px;">
            Se hai domande, contatta il nostro supporto.
          </p>
          
          <div class="footer">
            <p>Il team di ScriviAI</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}