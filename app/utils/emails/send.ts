import { encode } from 'next-auth/jwt';
import { render } from '@react-email/components';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import { serverConfig } from '@/config/server';
import SMTPPool from 'nodemailer/lib/smtp-pool';

declare module 'nodemailer' {
  function getTestMessageUrl(info: SMTPPool.SentMessageInfo): string | false;
}

const dkim = !!serverConfig.DKIM_DOMAIN
  ? {
      domainName: serverConfig.DKIM_DOMAIN,
      keySelector: serverConfig.DKIM_KEY_SELECTOR,
      privateKey: serverConfig.DKIM_PRIVATE_KEY,
    }
  : undefined;

const transporter = nodemailer.createTransport({
  host: serverConfig.EMAIL_HOST,
  port: serverConfig.EMAIL_PORT,
  secure: serverConfig.EMAIL_PORT === 465,
  auth: {
    user: serverConfig.EMAIL_USER,
    pass: serverConfig.EMAIL_PASS,
  },
  dkim,
  pool: true,
});

if (['development', 'test'].includes(process.env.NODE_ENV)) {
  const testAccount = await nodemailer.createTestAccount();

  console.error('Using test email credentials: \n', testAccount);

  const { transporter: testTransporter } = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
    dkim,
    pool: true,
  });

  transporter.transporter = testTransporter;
}

// verify connection configuration
transporter.verify((error: unknown) => {
  if (error) {
    console.log(error);
  } else {
    console.log('SMTP server is ready to take messages');
  }
});

/**
 * Send an email using the nodemailer transporter
 * @param from The email address to send from, supports name format like '"Maddison Foo Koch" <maddison53@ethereal.email>'
 * @param to The email address(es) to send to as a comma separated list like 'bar@example.com, baz@example.com'
 * @param subject The subject of the email
 * @param body The HTML content of the email
 */
export async function sendEmail(
  from: string,
  to: string,
  subject: string,
  body: string | React.ReactElement,
  opts: Mail.Options = {},
) {
  try {
    const html = typeof body === 'string' ? body : await render(body);
    const info = await transporter.sendMail({ from, to, subject, html, ...opts });

    if (['development', 'test'].includes(process.env.NODE_ENV))
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    else console.log('Message sent: %s', info.messageId);
  } catch (error) {
    if (error instanceof Error && 'responseCode' in error && error.responseCode === 429) {
      console.error('Rate limited by email provider, retrying in 10 seconds');
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await sendEmail(from, to, subject, body, opts);
    } else {
      console.error('Error sending email:', error);
    }
  }
}

export async function generateUnsubscribeUrl(email: string, sub: string, name: string) {
  const secret = serverConfig.NEXTAUTH_SECRET;
  const url = `${serverConfig.NEXTAUTH_URL}/api/notification/email-preferences`;
  const token = await encode({ token: { email, sub, name, aud: url }, secret });
  return `${url}?token=${token}`;
}
