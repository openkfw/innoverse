import { StaticImageData } from 'next/image';

import featured_project from '/public/images/featured_project.png';
import featured_project1 from '/public/images/featured_project1.png';
import featured_project2 from '/public/images/featured_project2.png';

export type SliderContent = {
  items: SliderItem[];
};
export type SliderItem = {
  image: {
    image: StaticImageData;
    title: string;
    projectFrom: string;
    projectTo: string;
    year: string;
  };
  text: {
    title: string;
    tags: string[];
    description: string;
  };
};

export const sliderContent = {
  items: [
    {
      image: {
        image: featured_project,
        title: 'Innovationsplattform',
        projectFrom: 'Jan',
        projectTo: 'Feb',
        year: '2023',
      },
      text: {
        title: 'Innovationsplattform',
        tags: ['Strategy', 'Future'],
        description:
          'Die Innovationsplattform ist der zentrale Ort für alle ***STRING_REMOVED*** ler, um sich über Innovation in ***STRING_REMOVED***  zu informieren und sich aktiv einzubringen.',
      },
    },
    {
      image: {
        image: featured_project1,
        title: 'Digitale Souveränität',
        projectFrom: 'Mar',
        projectTo: 'Jun',
        year: '2023',
      },
      text: {
        title: 'Digitale Souveränität',
        tags: ['Strategy', 'Future'],
        description: 'Unsere D&I-Förderprogramme sind offen für alle Technologien, um D&I möglichst breit zu fördern',
      },
    },
    {
      image: {
        image: featured_project2,
        title: 'Lead Transformation',
        projectFrom: 'Apr',
        projectTo: 'Aug',
        year: '2023',
      },
      text: {
        title: 'Lead Transformation',
        tags: ['Agility', 'Strategy', 'Future'],
        description:
          'Lead Transformation ist ein Entwicklungsprogramm für ***STRING_REMOVED*** -Führungskräfte und ist Anfang 2023 in die zweite Runde gestartet. Insgesamt besteht es aus fünf Modulen.',
      },
    },
    {
      image: {
        image: featured_project1,
        title: 'Trubudget',
        projectFrom: 'Jan',
        projectTo: 'Feb',
        year: '2023',
      },
      text: {
        title: 'Trubudget',
        tags: ['Blockchain', 'Future'],
        description: 'Verwendung von Blockchain Technologie, um Daten sicher und zuverlässig verteilt zu speichern.',
      },
    },
    {
      image: {
        image: featured_project,
        title: 'Oscar',
        projectFrom: 'Jan',
        projectTo: 'Aug',
        year: '2023',
      },
      text: {
        title: 'Oscar',
        tags: ['Human action', 'Future'],
        description: 'Mit OSCAR kann humanitäre Hilfe mit Satellitenkarten schneller ihren Weg finden.',
      },
    },
    {
      image: {
        image: featured_project,
        title: 'Trubduget As A Service',
        projectFrom: 'Jan',
        projectTo: 'Aug',
        year: '2023',
      },
      text: {
        title: 'Trubduget As A Service',
        tags: ['Blockchain', 'Future'],
        description: 'Einfacher Zugang zu TruBudget über eine Cloud Plattform',
      },
    },
  ],
};
