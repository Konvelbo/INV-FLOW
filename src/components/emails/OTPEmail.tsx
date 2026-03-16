import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Hr } from '@react-email/components';

interface OTPEmailProps {
    otp: string;
    lang?: 'fr' | 'en';
}

export const OTPEmail = ({ otp, lang = 'fr' }: OTPEmailProps) => {
    const isEn = lang === 'en';
    
    return (
        <Html>
            <Head />
            <Preview>{isEn ? "Your ESSOR verification code" : "Votre code de vérification ESSOR"}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Text style={headerTitle}>{isEn ? "Password Recovery" : "Récupération de mot de passe"}</Text>
                    </Section>
                    <Section style={content}>
                        <Text style={text}>{isEn ? "Hello," : "Bonjour,"}</Text>
                        <Text style={text}>
                            {isEn 
                                ? "You requested to reset your password on ESSOR. Here is your verification code (OTP):"
                                : "Vous avez demandé la réinitialisation de votre mot de passe sur ESSOR. Voici votre code de vérification (OTP) :"}
                        </Text>
                        <Section style={otpContainer}>
                            <Text style={otpText}>{otp}</Text>
                        </Section>
                        <Text style={text}>
                            {isEn
                                ? "This code is valid for 10 minutes. If you did not make this request, you can safely ignore this email."
                                : "Ce code est valable pendant 10 minutes. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité."}
                        </Text>
                    </Section>
                    <Hr style={hr} />
                    <Section style={footer}>
                        <Text style={footerText}>
                            {isEn ? "ESSOR ARCHITECTURE - Security & Performance." : "ESSOR ARCHITECTURE - Sécurité & Performance."}
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
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

const otpContainer = {
    margin: '32px 0',
    textAlign: 'center' as const,
    backgroundColor: '#f1f5f9',
    padding: '24px',
    borderRadius: '12px',
};

const otpText = {
    fontSize: '36px',
    fontWeight: 'bold',
    letterSpacing: '8px',
    color: '#0f172a',
    margin: '0',
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

export default OTPEmail;
