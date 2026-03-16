import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Button, Hr, Img } from '@react-email/components';

interface InvoiceEmailProps {
    clientName: string;
    invoiceReference: string;
    downloadLink: string;
    senderName: string;
    amount?: string;
    lang?: 'fr' | 'en';
}

export const InvoiceEmail = ({
    clientName,
    invoiceReference,
    downloadLink,
    senderName,
    amount,
    lang = 'fr',
}: InvoiceEmailProps) => {
    const isEn = lang === 'en';
    
    return (
        <Html>
            <Head />
            <Preview>
                {isEn 
                    ? `New invoice ${invoiceReference} from ${senderName}` 
                    : `Nouvelle facture ${invoiceReference} de ${senderName}`}
            </Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Text style={headerTitle}>
                            {isEn ? `Invoice ${invoiceReference}` : `Facture ${invoiceReference}`}
                        </Text>
                    </Section>
                    <Section style={content}>
                        <Text style={text}>{isEn ? `Hello ${clientName},` : `Bonjour ${clientName},`}</Text>
                        <Text style={text}>
                            {isEn
                                ? <>Please find attached the download link for your invoice <strong>{invoiceReference}</strong> issued by <strong>{senderName}</strong>.</>
                                : <>Veuillez trouver ci-joint le lien de téléchargement pour votre facture <strong>{invoiceReference}</strong> émise par <strong>{senderName}</strong>.</>}
                        </Text>
                        {amount && (
                            <Text style={text}>
                                {isEn ? "Total amount: " : "Montant total : "}<strong>{amount}</strong>
                            </Text>
                        )}
                        <Section style={buttonContainer}>
                            <Button style={button} href={downloadLink}>
                                {isEn ? "Download Invoice" : "Télécharger la facture"}
                            </Button>
                        </Section>
                        <Text style={text}>
                            {isEn
                                ? "If the button doesn't work, copy and paste this link into your browser:"
                                : "Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :"}
                            <br />
                            <a href={downloadLink} style={link}>{downloadLink}</a>
                        </Text>
                    </Section>
                    <Hr style={hr} />
                    <Section style={footer}>
                        <Text style={footerText}>
                            {isEn
                                ? "This email was sent automatically. Thank you for your trust!"
                                : "Cet e-mail a été envoyé automatiquement. Merci de votre confiance !"}
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const header = {
    padding: '32px',
    backgroundColor: '#0f172a',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
};

const headerTitle = {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    margin: '0',
};

const content = {
    padding: '32px',
};

const text = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '24px',
    marginBottom: '16px',
};

const link = {
    color: '#2563eb',
    textDecoration: 'underline',
};

const buttonContainer = {
    textAlign: 'center' as const,
    marginTop: '32px',
    marginBottom: '32px',
};

const button = {
    backgroundColor: '#0f172a',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
    fontWeight: 'bold',
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0',
};

const footer = {
    padding: '0 32px',
};

const footerText = {
    color: '#8898aa',
    fontSize: '12px',
    textAlign: 'center' as const,
};

export default InvoiceEmail;
