import { encode } from 'next-auth/jwt';

import { serverConfig } from '@/config/server';

type EmailParams = {
  from: string;
  to: string;
  subject: string;
  body: string;
};

export async function sendEmail({ from, to, subject, body }: EmailParams, templateId: number) {
  const url = `${serverConfig.ELAINE_ENDPOINT}/api_sendSingleTransaction`;
  const user = serverConfig.ELAINE_USER;
  const pass = serverConfig.ELAINE_PASS;

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64'),
  };

  const content = {
    c_email: to,
    t_subject: subject,
    t_html: body,
    t_sender: from,
    t_sendername: 'InnoVerse',
  };

  const json = [{ content }, templateId];

  const req_body = new URLSearchParams({
    json: JSON.stringify(json),
  });
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: req_body,
  });

  if (!response.ok) {
    console.error('Error sending single email:', response.statusText);
    throw new Error(`Error sending bulk email: ${response.statusText}`);
  }
  // JSON response ususally means an error occurred
  if (response.headers.get('content-type')?.includes('application/json')) {
    const data = await response.json();
    console.error('Error sending single email:', data);
    throw new Error(`Error sending single email: ${data}`);
  }
  // Successful response will return a table
  const text = await response.text();
  console.log('Single email sent:', text);
  return text;
}

export async function sendBulkEmail(emails: EmailParams[], templateId: number) {
  // if (serverConfig.NODE_ENV !== 'production') {
  //   const { sendSMTP } = await import('./smtp');
  //   return Promise.all(emails.map(({ from, to, subject, body }) => sendSMTP(from, to, subject, body)));
  // }

  const url = `${serverConfig.ELAINE_ENDPOINT}/bulk/api_sendSingleTransaction`;
  const user = serverConfig.ELAINE_USER;
  const pass = serverConfig.ELAINE_PASS;

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64'),
  };

  const json = emails.map(({ from, to, subject, body }) => {
    const content = {
      c_email: to,
      t_subject: subject,
      t_html: body,
      t_sender: from,
      t_sendername: 'InnoVerse',
    };

    return [{ content }, templateId];
  });

  const body = new URLSearchParams({
    json: JSON.stringify([json, false]),
  });
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });

  if (!response.ok) {
    console.error('Error sending bulk email:', response.statusText);
    throw new Error(`Error sending bulk email: ${response.statusText}`);
  }
  // JSON response on bulk endpoint ususally means an error occurred
  if (response.headers.get('content-type')?.includes('application/json')) {
    const data = await response.json();
    console.error('Error sending bulk email:', data);
    throw new Error(`Error sending bulk email: ${data}`);
  }
  // Successful response will return a table
  const text = await response.text();
  const data = parseResultTable(text);
  console.log('Bulk email sent:', data);
  return data;
}

function parseResultTable(html: string) {
  // structure: <table><tr><td>0</td><td>1072163</td></tr><tr><td>1</td><td>1072164</td></tr></table>
  const data = html.match(/<tr><td>(\d+)<\/td><td>(\d+)<\/td><\/tr>/g);
  if (!data) return [];
  return data.map((row) => {
    const [, id, result] = row.match(/<tr><td>(\d+)<\/td><td>(\d+)<\/td><\/tr>/) ?? [];
    return { id: parseInt(id, 10), result: parseInt(result, 10) };
  });
}

export async function generateUnsubscribeUrl(email: string, sub: string, name: string) {
  const secret = serverConfig.NEXTAUTH_SECRET;
  const url = `${serverConfig.NEXTAUTH_URL}/api/notification/email-preferences`;
  const token = await encode({ token: { email, sub, name, aud: url }, secret });
  return `${url}?token=${token}`;
}
