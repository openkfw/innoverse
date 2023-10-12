import { StaticImageData } from 'next/image';

import avatarMelanieImg from '/public/images/avatarMelanie.png';
import avatarTonyImg from '/public/images/avatarTony.png';

export type NewsSlider = {
  id: number;
  title: string;
  comment: string;
  theme: string;
  date: string;
  author: {
    name: string;
    avatar: StaticImageData;
  }
};

// export const news = [
//   {
//     id: 1,
//     title: 'Innovationsplattform',
//     subtitle:
//       'Wir arbeiten gerade an den ersten Seiten der Innovationsplattform, lasst gerne Eure Meinung zum Design da.',
//     theme: 'Plattform',
//     publisher: 'Maurice Suiker',
//     date: '12 Sep 2023',
//     avatar: avatarTonyImg,
//   },
//   {
//     id: 2,
//     title: 'Digitale Souveränität',
//     subtitle:
//       'Der erste Schritt ist geschafft! Wir haben die ersten Studien identifizert, gesichtet und sind diese nun am analysieren. Wir sind gespannt was wir herausfinden und halten euch auf dem Laufenden!',
//     theme: 'Research',
//     publisher: 'Tom Dapp',
//     date: '10 Sep 2023',
//     avatar: avatarTonyImg,
//   },
//   {
//     id: 3,
//     title: 'Lead Transformation',
//     subtitle:
//       '"Mich motiviert wenn meine eigene Idee ernst genommen und umgesetzt wird" Dieser Aussage konnten die meisten unserer Gen Z Umfrage Teilnehmer zustimmen. Die größte Ablehnung gab es bei folgender Aussage:/"Viele persönliche Inhalte im Jour fixe empfinde ich als Grenzüberschreitung./" Wie ist deine Meinung dazu?  Siehst du es auch so wie unsere Gen Z oder bist du ganz anderer Meinung? Lass es uns wissen!',
//     theme: 'Lead Transformation',
//     publisher: 'Ulrike Brandmeier',
//     date: '09 Sep 2023',
//     avatar: avatarMelanieImg,
//   },
//   {
//     id: 4,
//     title: 'Digitale Souveränität',
//     subtitle:
//       'Wir sind nun dabei die potenziellen Fokusthemen pro Zielgruppe auszuarbeiten. Wenn ihr noch Impulse und/oder Feedback habt,lasst es uns gerne wissen.',
//     theme: 'Digitale Souveränität',
//     publisher: 'Tom Dapp',
//     date: '07 Sep 2023',
//     avatar: avatarTonyImg,
//   },
//   {
//     id: 5,
//     title: 'Lead Transformation',
//     subtitle:
//       'Auch der dritte Durchgang unseres Moduls Digitalisierung und Innovation in Lead Transformation war ein voller Erfolg. Das Feedback der Führungskräfte ist durchweg positiv und das spiegelt sich auch wieder: Unser Modul ist als einziges bis Ende des Jahres ausgebucht!Echt klasse! Danke an alle die immer so tatkräftig unterstützten!',
//     theme: 'Leadership Training',
//     publisher: 'Michael Strauß',
//     date: '05 Sep 2023',
//     avatar: avatarTonyImg,
//   },
//   {
//     id: 6,
//     title: 'InDigO HF2',
//     subtitle:
//       'Die deutsche Initiative: „go-digital“ – (Ein Wegweiser für KMUs in das digitale Zeitalter) als Orientierung für InDigO. Wir haben die Evalution des Projekts gesichtet und analysiert um etwaige Verbesserungspotetiale und Schwachpunkte zu identifizieren und als Impulse mit einfließen zu lassen',
//     theme: 'Förderung KMU',
//     publisher: 'Remon Gerris',
//     date: '01 Sep 2023',
//     avatar: avatarTonyImg,
//   },
// ];
