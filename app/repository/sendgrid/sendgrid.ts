import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('Missing SENDGRID_API_KEY');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export default sgMail;

export const verified_email_address = process.env.SENDGRID_VERIFIED_EMAIL_ADDRESS;
