import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('Missing Sengrid env vars - SENDGRID_VERIFIED_EMAIL_ADDRESS');
}

if (!process.env.SENDGRID_VERIFIED_EMAIL_ADDRESS) {
  throw new Error('Missing Sengrid env vars - SENDGRID_VERIFIED_EMAIL_ADDRESS');
}

// Setup api key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Setup verified email address
export const verified_email_address = process.env.SENDGRID_VERIFIED_EMAIL_ADDRESS;

export default sgMail;
