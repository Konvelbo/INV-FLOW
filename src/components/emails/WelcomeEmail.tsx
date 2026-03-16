import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Button, Hr } from '@react-email/components';

interface WelcomeEmailProps {
    userName: string;
    lang?: 'fr' | 'en';
}

export const WelcomeEmail = ({ userName, lang = 'fr' }: WelcomeEmailProps) => {
    const isEn = lang === 'en';
    
    return (
        <Html>
            <Head />
            <Preview>{isEn ? `Welcome to ESSOR, ${userName}!` : `Bienvenue chez ESSOR, ${userName} !`}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Text style={headerTitle}>{isEn ? "Welcome to ESSOR" : "Bienvenue chez ESSOR"}</Text>
                    </Section>
                    <Section style={content}>
                        <Text style={text}>{isEn ? `Hello ${userName},` : `Bonjour ${userName},`}</Text>
                        <Text style={text}>
                            {isEn 
                                ? "We're delighted to have you! Your account has been successfully created on ESSOR ARCHITECTURE."
                                : "Nous sommes ravis de vous compter parmi nous ! Votre compte a été créé avec succès sur ESSOR ARCHITECTURE."}
                        </Text>
                        <Text style={text}>
                            {isEn
                                ? "You can now manage your invoices, analyze your growth, and drive your business with our Pulse™ intelligence."
                                : "Vous pouvez désormais gérer vos factures, analyser votre croissance et piloter votre activité avec notre intelligence Pulse™."}
                        </Text>
                        <Section style={buttonContainer}>
                            <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`}>
                                {isEn ? "Access my dashboard" : "Accéder à mon tableau de bord"}
                            </Button>
                        </Section>
                        <Text style={text}>
                            {isEn
                                ? "If you have any questions, our team is here to support you."
                                : "Si vous avez des questions, notre équipe est là pour vous accompagner."}
                        </Text>
                    </Section>
                    <Hr style={hr} />
                    <Section style={footer}>
                        <Text style={footerText}>
                            {isEn ? "ESSOR ARCHITECTURE - Operational Excellence." : "ESSOR ARCHITECTURE - L'excellence opérationnelle."}
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

export default WelcomeEmail;
