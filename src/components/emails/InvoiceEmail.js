/**
 * @typedef {Object} InvoiceEmailProps
 * @property {string} clientName
 * @property {string} invoiceReference
 * @property {string} downloadLink
 * @property {string} senderName
 * @property {string} [amount]
 * @property {"fr" | "en"} [lang]
 */

const React = require("react");
const {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
} = require("@react-email/components");

const e = React.createElement;

const InvoiceEmail = ({
  clientName,
  invoiceReference,
  downloadLink,
  senderName,
  amount,
  invoiceId,
  lang = "fr",
  isReminder = false,
  tone = "professional",
}) => {
  const isEn = lang === "en";
  const isFriendly = tone === "friendly";

  const getReminderText = () => {
    if (isEn) {
      return isFriendly
        ? `Just a friendly reminder regarding your invoice ${invoiceReference}. We would appreciate it if you could take a look when you have a moment.`
        : `This is a formal reminder that the payment for invoice ${invoiceReference} is currently pending. Please ensure payment is processed at your earliest convenience.`;
    }
    return isFriendly
      ? `Petit rappel amical concernant votre facture ${invoiceReference}. Nous vous remercions d'y jeter un œil dès que possible.`
      : `Ceci est une relance formelle concernant votre facture ${invoiceReference}. Le paiement est actuellement en attente. Merci de régulariser la situation dans les plus brefs délais.`;
  };

  return e(Html, null,
    e(Head, null),
    e(Preview, null,
      isReminder
        ? (isEn ? `Reminder: Invoice ${invoiceReference}` : `Rappel : Facture ${invoiceReference}`)
        : (isEn ? `New invoice ${invoiceReference} from ${senderName}` : `Nouvelle facture ${invoiceReference} de ${senderName}`)
    ),
    e(Body, { style: main },
      e(Container, { style: container },
        e(Section, { style: header },
          e(Text, { style: headerTitle },
            isReminder
              ? (isEn ? `Payment Reminder` : `Rappel de Paiement`)
              : (isEn ? `Invoice ${invoiceReference}` : `Facture ${invoiceReference}`)
          )
        ),
        e(Section, { style: content },
          e(Text, { style: text },
            isEn ? `Hello ${clientName},` : `Bonjour ${clientName},`
          ),
          e(Text, { style: text },
            isReminder ? getReminderText() : (
              isEn ? (
                e(React.Fragment, null,
                  "Please find attached the PDF for your invoice ",
                  e("strong", null, invoiceReference),
                  " issued by ",
                  e("strong", null, senderName),
                  "."
                )
              ) : (
                e(React.Fragment, null,
                  "Veuillez trouver ci-joint le PDF de votre facture ",
                  e("strong", null, invoiceReference),
                  " émise par ",
                  e("strong", null, senderName),
                  "."
                )
              )
            )
          ),
          amount && e(Text, { style: text },
            isEn ? "Total amount: " : "Montant total : ",
            e("strong", null, amount)
          ),
          downloadLink && e(Section, { style: buttonContainer },
            e(Button, { style: button, href: downloadLink },
              isEn ? "Download Invoice" : "Télécharger la facture"
            )
          ),
          (downloadLink && !isReminder) && e(Text, { style: text },
            isEn
              ? "If the button doesn't work, copy and paste this link into your browser:"
              : "Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :",
            e("br", null),
            e("a", { href: downloadLink, style: link }, downloadLink)
          )
        ),
        e(Hr, { style: hr }),
        e(Section, { style: footer },
          e(Text, { style: footerText },
            isEn
              ? "This email was sent automatically. Thank you for your trust!"
              : "Cet e-mail a été envoyé automatiquement. Merci de votre confiance !"
          )
        ),
        invoiceId && e("img", {
          src: (() => {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://essor.app';
            // Ensure we have a protocol, otherwise the pixel fails in most email clients
            const absoluteUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
            return `${absoluteUrl}/api/track/v?id=${invoiceId}`;
          })(),
          width: "1",
          height: "1",
          alt: "",
          style: { display: "none" }
        })
      )
    )
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const header = {
  padding: "32px",
  backgroundColor: "#0f172a",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center",
  margin: "0",
};

const content = {
  padding: "32px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "16px",
};

const link = {
  color: "#2563eb",
  textDecoration: "underline",
};

const buttonContainer = {
  textAlign: "center",
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#0f172a",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center",
  display: "inline-block",
  padding: "12px 24px",
  fontWeight: "bold",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  padding: "0 32px",
};

const footerText = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center",
};

module.exports = InvoiceEmail;
