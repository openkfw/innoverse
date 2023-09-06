import { StaticImageData } from 'next/image';
import project1 from '/public/images/project1.png';
import project2 from '/public/images/project2.png';
import project3 from '/public/images/project3.png';

export enum PROJECT_PROGRESS {
  EXPLORATION = 'Exploration',
  KONZEPTION = 'Konzeption',
  PROOF_OF_CONCEPT = 'Proof of Concept',
}

export type ProjectCarouselItem = {
  id: number;
  image: StaticImageData;
  contributors: string[];
  progress: PROJECT_PROGRESS;
  description: string;
  title: string
};

export const projects = [
  {
    id: 1,
    image: project1,
    title: 'Digitale Souveränität',
    contributors: ['Max Muster', 'Lisa Laimberger', 'Bernhard Brunner'],
    progress: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
    description: 'Unsere D&I-Förderprogramme sind offen für alle Technologien, um D&I möglichst breit zu fördern',

  },
  {
    id: 2,
    image: project2,
    title: 'Lead Transformation',
    contributors: ['Max Muster', 'Lisa Laimberger'],
    progress: PROJECT_PROGRESS.KONZEPTION,
    description:
      'Lead Transformation ist ein Entwicklungsprogramm für ***STRING_REMOVED*** -Führungskräfte und ist Anfang 2023 in die zweite Runde gestartet. Insgesamt besteht es aus fünf Modulen.'

  },
  {
    id: 3,
    image: project3,
    title: 'Trubudget',
    contributors: ['Max Muster', 'Lisa Laimberger', 'Bernhard Brunner'],
    progress: PROJECT_PROGRESS.KONZEPTION,
    description:
      'Verwendung von Blockchain Technologie, um Daten sicher und zuverlässig verteilt zu speichern.',

  },
  {
    id: 4,
    image: project1,
    title: 'Oscar',
    contributors: ['Max Muster', 'Lisa Laimberger', 'Bernhard Brunner'],
    progress: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
    description:
      'Mit OSCAR kann humanitäre Hilfe mit Satellitenkarten schneller ihren Weg finden.',

  },
  {
    id: 5,
    image: project2,
    title: 'Trubduget As A Service',
    contributors: ['Max Muster', 'Lisa Laimberger'],
    description:
      'Einfacher Zugang zu TruBudget über eine Cloud Plattform',

  },

];
