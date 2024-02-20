export function openWebex(email: string | undefined) {
  if (email) {
    const webexTeamsUrl = `webexteams://im?email=${encodeURIComponent(email)}`;
    const mailtoLink = `mailto:${email}`;

    if (confirm("Open in Webex Teams? Click 'Cancel' to send an email instead.")) {
      window.open(webexTeamsUrl, '_blank');
    } else {
      window.open(mailtoLink);
    }
  }
}
