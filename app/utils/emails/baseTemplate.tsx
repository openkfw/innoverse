'use server';

import * as React from 'react';
import { Body, Container, Font, Head, Hr, Html, Img, Link, Preview, Section, Text } from '@react-email/components';

export type EmailTemplateProps = {
  children: React.ReactNode;
  includeUnsubscribe?: UnsubscribeFooterUrls;
  baseUrl: string;
  baseImageUrl: string;
  content: {
    preview: string;
    footerActivityNote: string;
    footerContactUs: string;
    footerPrivacy: string;
    footerAddress: string;
    footerSmallLogo: { url: string } | null;
    headerLogo: { url: string } | null;
    lang: string;
    footerUnsubscribe: string;
    footerEmailSettings: string;
  };
};

export type UnsubscribeFooterUrls = {
  unsubscribeUrl: string;
  emailSettingsUrl: string;
};

export type UnsubscribeFooterLinksProps = UnsubscribeFooterUrls & {
  unsubscribeText: string;
  settingsText: string;
};

export const UnsubscribeFooterLinks = async ({
  unsubscribeUrl,
  emailSettingsUrl,
  unsubscribeText,
  settingsText,
}: UnsubscribeFooterLinksProps) => (
  <>
    <Link href={unsubscribeUrl} style={footerLink}>
      {unsubscribeText + ' '}
    </Link>
    <Link href={emailSettingsUrl} style={footerLink}>
      {settingsText + ' '}
    </Link>
  </>
);

export const InnoVerseEmail = async ({
  baseUrl,
  baseImageUrl,
  children,
  content,
  includeUnsubscribe,
}: EmailTemplateProps) => (
  <Html lang={content.lang}>
    <Head>
      <Font
        fontFamily="SansDefaultMed"
        fallbackFontFamily={['Helvetica', 'Arial', 'sans-serif']}
        webFont={{
          url: baseUrl + '/fonts/Sans-Default-Reg.woff2',
          format: 'woff2',
        }}
        fontWeight={400}
        fontStyle="normal"
      />
      <Font
        fontFamily="SlabReg"
        fallbackFontFamily="serif"
        webFont={{
          url: baseUrl + '/fonts/Slab-Reg.woff2',
          format: 'woff2',
        }}
        fontWeight={400}
        fontStyle="normal"
      />
    </Head>
    <Preview>{content.preview}</Preview>
    <Body style={main}>
      <Container style={containerStyle}>
        <Section style={logo}>
          <Img width={146} src={baseImageUrl + content.headerLogo?.url} />
        </Section>
        {children}
      </Container>

      <Section style={footerStyle}>
        <Text style={footerText}>{content.footerActivityNote}</Text>

        {includeUnsubscribe && (
          <UnsubscribeFooterLinks
            {...includeUnsubscribe}
            unsubscribeText={content.footerUnsubscribe}
            settingsText={content.footerEmailSettings}
          />
        )}
        <Link href={baseUrl} style={footerLink}>
          {content.footerContactUs}
        </Link>
        <Link href={baseUrl} style={footerLink}>
          {content.footerPrivacy}
        </Link>

        <Hr style={footerDivider} />

        <Img width={111} src={baseImageUrl + content.footerSmallLogo?.url} />
        <Text style={footerAddress}>
          <strong>{content.footerAddress}</strong>
        </Text>
      </Section>
    </Body>
  </Html>
);

export default InnoVerseEmail;

const main = {
  backgroundColor: '#f3f3f5',
  fontFamily: 'SansDefaultMed,Roboto,"Helvetica Neue",Arial,sans-serif',
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
