import * as React from 'react';
import { Body, Container, Head, Hr, Html, Img, Link, Preview, Section, Text } from '@react-email/components';

import { serverConfig } from '@/config/server';

// TODO: use something else???
export const baseUrl = serverConfig.NEXTAUTH_URL;

export type EmailTemplateProps = {
  children: React.ReactNode;
  lang: string;
  preview: string;
  includeUnsubscribe?: UnsubscribeFooterLinksProps;
};

export type UnsubscribeFooterLinksProps = {
  unsubscribeUrl: string;
  emailSettingsUrl: string;
};

export const UnsubscribeFooterLinks = ({ unsubscribeUrl, emailSettingsUrl }: UnsubscribeFooterLinksProps) => (
  <>
    <Link href={unsubscribeUrl} style={footerLink}>
      Unsubscribe from emails like this{' '}
    </Link>
    <Link href={emailSettingsUrl} style={footerLink}>
      Edit email settings{' '}
    </Link>
  </>
);

export const InnoVerseEmail = ({ children, lang, preview, includeUnsubscribe }: EmailTemplateProps) => (
  <Html lang={lang}>
    <Head />
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={containerStyle}>
        <Section style={logo}>
          <Img width={146} src={`${baseUrl}/_next/static/chunks/images/logo.svg`} />
        </Section>
        {children}
      </Container>

      <Section style={footerStyle}>
        <Text style={footerText}>
          You&apos;re receiving this email because your InnoVerse activity triggered this notification.
        </Text>

        {includeUnsubscribe && <UnsubscribeFooterLinks {...includeUnsubscribe} />}
        <Link href="/" style={footerLink}>
          Contact us
        </Link>
        <Link href="/" style={footerLink}>
          Privacy
        </Link>

        <Hr style={footerDivider} />

        <Img width={111} src={`${baseUrl}/static/logo-sm.png`} />
        <Text style={footerAddress}>
          <strong>InnoVerse</strong>
        </Text>
        <Text style={footerHeart}>{'<3'}</Text>
      </Section>
    </Body>
  </Html>
);

export default InnoVerseEmail;

const main = {
  backgroundColor: '#f3f3f5',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
};

const divider = {
  margin: '30px 0',
};

const containerStyle = {
  width: '680px',
  maxWidth: '100%',
  margin: '0 auto',
  backgroundColor: '#ffffff',
};

const footerStyle = {
  width: '680px',
  maxWidth: '100%',
  margin: '32px auto 0 auto',
  padding: '0 30px',
};

const logo = {
  display: 'flex',
  background: '#f3f3f5',
  padding: '20px 30px',
};

const footerDivider = {
  ...divider,
  borderColor: '#d6d8db',
};

const footerText = {
  fontSize: '12px',
  lineHeight: '15px',
  color: '#9199a1',
  margin: '0',
};

const footerLink = {
  display: 'inline-block',
  color: '#9199a1',
  textDecoration: 'underline',
  fontSize: '12px',
  marginRight: '10px',
  marginBottom: '0',
  marginTop: '8px',
};

const footerAddress = {
  margin: '4px 0',
  fontSize: '12px',
  lineHeight: '15px',
  color: '#9199a1',
};

const footerHeart = {
  borderRadius: '1px',
  border: '1px solid #d6d9dc',
  padding: '4px 6px 3px 6px',
  fontSize: '11px',
  lineHeight: '11px',
  fontFamily: 'Consolas,monospace',
  color: '#e06c77',
  maxWidth: 'min-content',
  margin: '0 0 32px 0',
};
