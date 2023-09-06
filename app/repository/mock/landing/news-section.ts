import { StaticImageData } from 'next/image';

import avatarImg from '/public/images/avatar.png';

export type NewsSlider = {
  id: number;
  title: string;
  subtitle: string;
  theme: string;
  publisher: string;
  date: string;
  avatar: StaticImageData;
};

export const news = [
  {
    id: 1,
    title: 'Innovationsplattform',
    subtitle:
      'Wir arbeiten gerade an den ersten Seiten der Innovationsplattform, lasst gerne Eure Meinung zum Design da.',
    theme: 'Plattform',
    publisher: 'Ingmar Müller',
    date: '12 Sep 2023',
    avatar: avatarImg,
  },
  {
    id: 2,
    title: 'Digitale Souveränität',
    subtitle:
      'Der erste Schritt ist geschafft! Wir haben die ersten Studien identifizert, gesichtet und sind diese nun am analysieren. Wir sind gespannt was wir herausfinden und halten euch auf dem Laufenden!',
    theme: 'Research',
    publisher: 'Tom Dapp',
    date: '12 Sep 2023',
    avatar: avatarImg,
  },
  {
    id: 3,
    title: 'Lead Transformation',
    subtitle:
      '"Mich motiviert wenn meine eigene Idee ernst genommen und umgesetzt wird/" Dieser Aussage konnten die meisten unserer Gen Z Umfrage Teilnehmer zustimmen. Die größte Ablehnung gab es bei folgender Aussage:/"Viele persönliche Inhalte im Jour fixe empfinde ich als Grenzüberschreitung./" Wie ist deine Meinung dazu?  Siehst du es auch so wie unsere Gen Z oder bist du ganz anderer Meinung? Lass es uns wissen!',
    theme: 'Lead Transformation',
    publisher: 'Maurice Suiker',
    date: '12 Sep 2023',
    avatar: avatarImg,
  },
  {
    id: 4,
    title: 'Digitale Souveränität',
    subtitle:
      'Wir sind nun dabei die potenziellen Fokusthemen pro Zielgruppe auszuarbeiten. Wenn ihr noch Impulse und/oder Feedback habt,lasst es uns gerne wissen.',
    theme: 'Digitale Souveränität',
    publisher: 'Muster Macintosh',
    date: '12 Sep 2023',
    avatar: avatarImg,
  },
  {
    id: 5,
    title: 'Digitale Souveränität',
    subtitle:
      'Wir sind nun dabei die potenziellen Fokusthemen pro Zielgruppe auszuarbeiten. Wenn ihr noch Impulse und/oder Feedback habt,lasst es uns gerne wissen.',
    theme: 'Digitale Souveränität',
    publisher: 'Muster Macintosh',
    date: '12 Sep 2023',
    avatar: avatarImg,
  },
];
