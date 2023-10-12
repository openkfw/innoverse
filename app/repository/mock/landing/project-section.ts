import { StaticImageData } from 'next/image';

import { PROJECT_PROGRESS } from '@/common/types';

// import featured_project_ai from '/public/images/ai_01.png';
// import featured_project_ai2 from '/public/images/ai_02.png';
// import featured_project_data from '/public/images/datacenter_01.png';
// import featured_project_energy from '/public/images/energy_02.png';
// import featured_project_energy2 from '/public/images/energy_03.png';
// import featured_project_room from '/public/images/room_01.png';

export type ProjectCarouselItem = {
  id: number;
  image: StaticImageData;
  team: {name: string}[];
  status: PROJECT_PROGRESS;
  summary: string;
  title: string;
};

// export const projects = [
//   {
//     id: 0,
//     image: featured_project_ai,
//     title: 'Generative KI für ***STRING_REMOVED*** ',
//     contributors: ['Rupert Rebentisch', 'Willem Behrenbeck', 'Ingmar Müller'],
//     progress: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
//     description:
//       'Wir wollen generative KI in ***STRING_REMOVED***  bringen, und ermitteln gemeinsam mit den Bereichen die sinnvollsten Anwendungsfälle.',
//   },
//   {
//     id: 1,
//     image: featured_project_ai2,
//     title: 'Lead Transformation',
//     contributors: ['Matthias Zorn', 'Ulrike Brandmeier'],
//     progress: PROJECT_PROGRESS.KONZEPTION,
//     description:
//       'Lead Transformation ist ein Entwicklungsprogramm für ***STRING_REMOVED*** -Führungskräfte und ist Anfang 2023 in die zweite Runde gestartet. Insgesamt besteht es aus fünf Modulen.',
//   },
//   {
//     id: 2,
//     image: featured_project_room,
//     title: 'Innovationsplattform',
//     contributors: ['Ingmar Müller', 'Maurice Suiker', 'Remon Gerris'],
//     progress: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
//     description:
//       'Die Innovationsplattform ist der zentrale Ort für alle ***STRING_REMOVED*** ler:innen, um sich über Innovation in ***STRING_REMOVED***  zu informieren und sich aktiv einzubringen.',
//   },
//   {
//     id: 3,
//     image: featured_project_ai,
//     title: 'Jahresabschluss-KI für die IPEX',
//     contributors: ['Caroline Löffler', 'Micheala Altmeyer', 'Christina Wittwer', 'Syndey Richards', 'Tobias Richter'],
//     progress: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
//     description:
//       'JaKI hilft den Risikoanalysten bei der Analyse von Unternehmensberichten sowie der Risikobewertung der Unternehmen.',
//   },
//   {
//     id: 6,
//     image: featured_project_data,
//     title: 'Digitale Souveränität',
//     contributors: ['Max Muster', 'Lisa Laimberger', 'Bernhard Brunner'],
//     progress: PROJECT_PROGRESS.EXPLORATION,
//     description: 'Wir analysieren, mit welchen Angeboten ***STRING_REMOVED***  bestmöglich Digitale Souveräntität fördern kann.',
//   },
//   {
//     id: 4,
//     image: featured_project_energy,
//     title: 'Oscar',
//     contributors: ['Max Muster', 'Lisa Laimberger', 'Bernhard Brunner'],
//     progress: PROJECT_PROGRESS.KONZEPTION,
//     description: 'Mit OSCAR kann humanitäre Hilfe mit Satellitenkarten schneller ihren Weg finden.',
//   },
//   {
//     id: 5,
//     image: featured_project_energy2,
//     title: 'Trubduget As A Service',
//     contributors: ['Max Muster', 'Lisa Laimberger'],
//     progress: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
//     description: 'Schnell und einfach ein TruBudget für Deinen Anwendungsfall erstellen.',
//   },
// ];
