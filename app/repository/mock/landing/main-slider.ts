import { StaticImageData } from 'next/image';

import featured_project_ai from '/public/images/ai_01.png';
import featured_project_ai2 from '/public/images/ai_02.png';
import featured_project_data from '/public/images/datacenter_01.png';
import featured_project_energy from '/public/images/energy_02.png';
import featured_project_energy2 from '/public/images/energy_03.png';

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
        image: featured_project_data,
        title: 'DS',
        projectFrom: 'Mar',
        projectTo: 'Nov',
        year: '2023',
      },
      text: {
        title: 'Digitale Souveränität fördern',
        tags: ['Strategie', 'Förderung'],
        description:
          'Wir arbeiten an der Fragestellung, wie wir Souveräntität von Deutschland und Europa auch im digitalen Raum ermöglichen können.',
      },
    },
    {
      image: {
        image: featured_project_energy2,
        title: 'InDigO',
        projectFrom: 'Aug',
        projectTo: 'Dez',
        year: '2023',
      },
      text: {
        title: 'Digitalisierung von KMU fördern',
        tags: ['Digital', 'Förderung', 'KMU', 'Innovation'],
        description:
          'Das Ziel des Projekts ist die Erstellung und Erprobung von Lösungskonzepten, die zur Erhöhung des Digitalisuerngsgrads von KMU beitragen - finanziell und nicht-finanzell.',
      },
    },
    {
      image: {
        image: featured_project_ai2,
        title: 'LT',
        projectFrom: 'Apr',
        projectTo: 'Aug',
        year: '2023',
      },
      text: {
        title: 'Lead Transformation',
        tags: ['Agilität', 'Strategie', 'Jahrzehnt der Entscheidung'],
        description:
          'Lead Transformation ist ein Entwicklungsprogramm für ***STRING_REMOVED*** -Führungskräfte und ist Anfang 2023 in die zweite Runde gestartet. Insgesamt besteht es aus fünf Modulen.',
      },
    },
    {
      image: {
        image: featured_project_energy,
        title: 'Bürgerenergie',
        projectFrom: 'Jan',
        projectTo: 'Feb',
        year: '2023',
      },
      text: {
        title: 'Energie genossen fördern',
        tags: ['Förderung', 'Transformation', 'Nachhaltigkeit'],
        description: 'Wir untersuchen, ob Bürgerenergie-Gemeinschaften als Transformationsbeschleuniger wirkung können - u.a. durch Mobilisierung vno privatem Kapital, durch verbesserte Akzeptanz der Energiewende und ggf. sogar durch Verringerung des Handwerker:innenmangels.',
      },
    },
    {
      image: {
        image: featured_project_ai,
        title: 'KI',
        projectFrom: 'Mai',
        projectTo: 'Nov',
        year: '2023',
      },
      text: {
        title: 'Generative KI für ***STRING_REMOVED***  nutzen',
        tags: ['KI', '***STRING_REMOVED***  Prozesse', 'Effizienzen'],
        description:
          'IT und KE arbeiten gemeinsam daran, wertstiftende Einsatzmöglichkeiten für generative KI in ***STRING_REMOVED***  zu identifizieren, zu bewerten und zu priorisieren.',
      },
    },
  ],
};
