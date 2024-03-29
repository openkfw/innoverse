import { errorMessage } from '@/components/common/CustomToast';

export function openWebex(email: string | undefined) {
  if (email) {
    const [localPart, domain] = email.split('@');
    if (!domain) {
      errorMessage({ message: 'Invalid email address.' });
      return;
    }

    const encodedLocalPart = encodeURIComponent(localPart);
    const webexTeamsUrl = `webexteams://im?email=${encodedLocalPart}@${domain}`;
    const mailtoLink = `mailto:${email}`;

    if (confirm("Open in Webex Teams? Click 'Cancel' to send an email instead.")) {
      window.open(webexTeamsUrl, '_blank');
    } else {
      window.open(mailtoLink);
    }
  }
}
