import { PROJECT_PROGRESS } from '@/common/types';

import GenerativeAI from './projects/GenerativeAI.md';

import avatarMaxImg from '/public/images/avatarMax.png';
import avatarMelanieImg from '/public/images/avatarMelanie.png';
import avatarSusanImg from '/public/images/avatarSusan.png';
import avatarTonyImg from '/public/images/avatarTony.png';
import featured_project from '/public/images/featured_project.png';

//TODO: define types after ui is implemented - there might be some changes
export const projects_progression: any = {
  writeCommentText: 'Gib hier deinen Kommentar zu diesem Artikel ein.',
  projects: [
    {
      projectId: 1,
      hero: {
        image: featured_project,
        title: 'Generative KI für ***STRING_REMOVED***  nutzen',
        author: {
          name: 'Ingmar Müller',
          role: 'Innovation Hub',
          avatar: avatarMaxImg,
        },
        projectStatus: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
      },
      projectSummary: {
        projectName: 'TruBudget',
        summary: '',
        timing: {
          projectStart: 'Aug',
          projectEnd: 'Nov 2023',
        },
        collaboration: {
          description:
            'Dein Feedback ist uns sehr wichtig. Bitte teile uns deine Gedanken, Anregungen und Ideen mit. Gemeinsam können wir großartige Veränderungen bewirken.',
          upvotes: 54,
          participants: 14,
        },
        likes: 153,
        followers: 43,
        teamMembers: [
          {
            name: 'Willem Behrenbeck',
            role: 'BDAI Experte',
            avatar: avatarTonyImg,
          },
          {
            name: 'Ingmar Müller',
            role: 'Innovation Hub',
            avatar: avatarSusanImg,
          },
          {
            name: 'Rupert Rebentisch',
            role: 'Tech Innovation Champion',
            avatar: avatarMaxImg,
          },
          {
            name: 'Michael Strauß',
            role: 'Innovation Hub',
            avatar: avatarMaxImg,
          },
        ],
        updates: [
          {
            author: {
              name: 'Rupert Rebentisch',
              avatar: avatarMaxImg,
              role: 'Tech Innovation Champion',
            },
            date: '12. Aug 2023',
            content:
              'Wir haben unsere Ergebnisse dem Vorstand präsentiert, sehr gute Diskussion und viel Unterstützung - jetzt kanns losgehen',
          },
          {
            author: {
              name: 'Willem Behrenbeck',
              avatar: avatarTonyImg,
              role: 'BDAI Experte',
            },
            date: '4. Jul 2023',
            content: 'Wir haben jetzt ein Konzept erstellt, um Generative KI in ***STRING_REMOVED***  zu ermöglichen',
          },
          {
            author: {
              name: 'Ingmar Müller',
              avatar: avatarMaxImg,
              role: 'Innovation Hub',
            },
            date: '12. Jul 2023',
            content:
              'Wir haben heute dem Bereich BR eine Einführung in KI und Generative KI gegeben - hat Spaß gemacht!',
          },
        ],
      },
      projectStatus: {
        projectName: 'Generative AI',
        text: GenerativeAI,
        author: {
          name: 'Ingmar Müller',
          role: 'Innovation Hub',
          avatar: avatarMaxImg,
          points: 536,
          department: 'KEe, Frankfurt am Main',
        },
        tags: ['KI', 'Effizienz', 'Geschäftsbereiche', 'AI'],
        info: {
          title: 'Künstliche Intelligenz',
          description: 'Generative KI könnte ein Gamechanger für die Zusammenarbeit zwischen Mensch und Maschine sein.',
        },
      },
      comments: [
        {
          id: 1,
          author: {
            name: 'Willem Behrenbeck',
            avatar: avatarMaxImg,
            role: 'BDAI Experte',
          },
          comment:
            'Danke, super spannend. Mich würde interessieren, wie ihr beim Thema Datenschutz und IP vorgeht, schreibt doch dazu mal ein Update.',
          upvotes: 15,
          downvotes: 0,
        },
        {
          id: 2,
          author: {
            name: 'Melanie Muster',
            role: 'Junior Scientist',
            avatar: avatarMelanieImg,
          },
          comment: 'Könnt ihr mal Eure Architektur mit uns teilen, für uns auch super spannend.',
          upvotes: 2,
          downvotes: 0,
        },
      ],
      questions: [
        'Hast Du Fragen zum Projekt? Welche Informationen fehlen Dir noch? Was möchtest Du in Zukunft von uns hören?',
      ],
    },
    {
      projectId: 2,
      hero: {
        image: featured_project,
        title: 'Generative KI für ***STRING_REMOVED***  nutzen',
        author: {
          name: 'Ingmar Müller',
          role: 'Innovation Hub',
          avatar: avatarMaxImg,
        },
        projectStatus: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
      },
      projectSummary: {
        projectName: 'InnoHub',
        summary:
          'Die Innovationsplattform ist der zentrale Ort für alle ***STRING_REMOVED*** ler, um sich über Innovation in ***STRING_REMOVED***  zu informieren und sich aktiv einzubringen.',
        timing: {
          projectStart: 'Okt 2022',
          projectEnd: 'Nov 2023',
        },
        collaboration: {
          description:
            'Dein Feedback ist uns sehr wichtig. Bitte teile uns deine Gedanken, Anregungen und Ideen mit. Gemeinsam können wir großartige Veränderungen bewirken.',
          upvotes: 54,
          participants: 14,
        },
        likes: 153,
        followers: 43,
        teamMembers: [
          {
            name: 'Willem Behrenbeck',
            role: 'BDAI Experte',
            avatar: avatarTonyImg,
          },
          {
            name: 'Ingmar Müller',
            role: 'Innovation Hub',
            avatar: avatarMaxImg,
          },
          {
            name: 'Rupert Rebentisch',
            role: 'Tech Innovation Champion',
            avatar: avatarMaxImg,
          },
        ],
        updates: [
          {
            author: {
              name: 'Rupert Rebentisch',
              avatar: avatarMaxImg,
              role: 'Tech Innovation Champion',
            },
            date: '12. Aug 2023',
            content:
              'Wir haben unsere Ergebnisse dem Vorstand präsentiert, sehr gute Diskussion und viel Unterstützung - jetzt kanns losgehen',
          },
          {
            author: {
              name: 'Willem Behrenbeck',
              avatar: avatarTonyImg,
              role: 'BDAI Experte',
            },
            date: '4. Jul 2023',
            content: 'Wir haben jetzt ein Konzept erstellt, um Generative KI in ***STRING_REMOVED***  zu ermöglichen',
          },
          {
            author: {
              name: 'Ingmar Müller',
              avatar: avatarMaxImg,
              role: 'Innovation Hub',
            },
            date: '12. Jul 2023',
            content:
              'Wir haben heute dem Bereich BR eine Einführung in KI und Generative KI gegeben - hat Spaß gemacht!',
          },
        ],
      },
      projectStatus: {
        projectName: 'InnoHub',
        text: '',
        author: {
          name: 'Max Muster',
          role: 'Junior Scientist',
          avatar: avatarMaxImg,
          points: 536,
          department: 'Department ABC, Frankfurt am Main',
        },
        tags: ['Gesellschaft', 'Bildung', 'Gründen', 'AI'],
        info: {
          title: 'Künstliche Intelligenz',
          description: 'Generative KI könnte ein Gamechanger für die Zusammenarbeit zwischen Mensch und Maschine sein.',
        },
      },
      comments: [
        {
          id: 1,
          author: {
            name: 'Willem Behrenbeck',
            role: 'BDAI Experte',
            avatar: avatarTonyImg,
          },
          comment:
            "I'm thrilled to hear about your innovation project! Innovation is such an exciting space to be in. My advice would be to ensure you have a diverse team with varied perspectives and skills om different anom different anom different an. This can lead to more creative solutions and help you anticipate challenges from different angles. Also, consider creating a culture of experimentation and learning from failures. It's often in our failures that we find the seeds of great innovation.",
          upvotes: 15,
          downvotes: 0,
        },
        {
          id: 2,
          author: {
            name: 'Melanie Muster',
            role: 'Junior Scientist',
            avatar: avatarMelanieImg,
          },
          comment:
            'Yes. To hear about your innovation project! Innovation is such an exciting space to be in. My advice would be to ensure you have a diverse team with varied perspectives and skills.',
          upvotes: 2,
          downvotes: 0,
        },
      ],
      questions: [
        'Hast du in letzter Zeit Banking-Innovationen erlebt, die deine Art der Finanzverwaltung verändert haben?',
        'Wie hat die Technologie deine persönlichen Bankinteraktionen beeinflusst?',
        'Könntest du eine persönliche Geschichte über eine Bankinnovation teilen, die sich auf dich ausgewirkt hat?',
      ],
    },
    {
      projectId: 3,
      hero: {
        image: featured_project,
        title: 'Generative KI für ***STRING_REMOVED***  nutzen',
        author: {
          name: 'Ingmar Müller',
          role: 'Innovation Hub',
          avatar: avatarMaxImg,
        },
        projectStatus: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
      },
      projectSummary: {
        projectName: 'Generative AI',
        summary:
          'Die Innovationsplattform ist der zentrale Ort für alle ***STRING_REMOVED*** ler, um sich über Innovation in ***STRING_REMOVED***  zu informieren und sich aktiv einzubringen.',
        timing: {
          projectStart: 'Okt 2022',
          projectEnd: 'Nov 2023',
        },
        collaboration: {
          description:
            'Dein Feedback ist uns sehr wichtig. Bitte teile uns deine Gedanken, Anregungen und Ideen mit. Gemeinsam können wir großartige Veränderungen bewirken.',
          upvotes: 54,
          participants: 14,
        },
        likes: 153,
        followers: 43,
        teamMembers: [
          {
            name: 'Willem Behrenbeck',
            role: 'BDAI Experte',
            avatar: avatarMaxImg,
          },
          {
            name: 'Ingmar Müller',
            role: 'Innovation Hub',
            avatar: avatarMaxImg,
          },
          {
            name: 'Rupert Rebentisch',
            role: 'Tech Innovation Champion',
            avatar: avatarMaxImg,
          },
        ],
        updates: [
          {
            author: {
              name: 'Rupert Rebentisch',
              avatar: avatarMaxImg,
              role: 'Tech Innovation Champion',
            },
            date: '12. Aug 2023',
            content:
              'Wir haben unsere Ergebnisse dem Vorstand präsentiert, sehr gute Diskussion und viel Unterstützung - jetzt kanns losgehen',
          },
          {
            author: {
              name: 'Willem Behrenbeck',
              avatar: avatarMaxImg,
              role: 'BDAI Experte',
            },
            date: '4. Jul 2023',
            content: 'Wir haben jetzt ein Konzept erstellt, um Generative KI in ***STRING_REMOVED***  zu ermöglichen',
          },
          {
            author: {
              name: 'Ingmar Müller',
              avatar: avatarMaxImg,
              role: 'Innovation Hub',
            },
            date: '12. Jul 2023',
            content:
              'Wir haben heute dem Bereich BR eine Einführung in KI und Generative KI gegeben - hat Spaß gemacht!',
          },
        ],
      },
      projectStatus: {
        projectName: 'Generative AI',
        text: '',
        author: {
          name: 'Max Muster',
          role: 'Junior Scientist',
          avatar: avatarMaxImg,
          points: 536,
          department: 'Department ABC, Frankfurt am Main',
        },
        tags: ['Gesellschaft', 'Bildung', 'Gründen', 'AI'],
        info: {
          title: 'Künstliche Intelligenz',
          description: 'Generative KI könnte ein Gamechanger für die Zusammenarbeit zwischen Mensch und Maschine sein.',
        },
      },
      comments: [
        {
          id: 1,
          author: {
            name: 'Willem Behrenbeck',
            role: 'BDAI Experte',
            avatar: avatarMaxImg,
          },
          comment:
            "I'm thrilled to hear about your innovation project! Innovation is such an exciting space to be in. My advice would be to ensure you have a diverse team with varied perspectives and skills om different anom different anom different an. This can lead to more creative solutions and help you anticipate challenges from different angles. Also, consider creating a culture of experimentation and learning from failures. It's often in our failures that we find the seeds of great innovation. ",
          upvotes: 15,
          downvotes: 0,
        },
        {
          id: 2,
          author: {
            name: 'Melanie Muster',
            role: 'Junior Scientist',
            avatar: avatarMelanieImg,
          },
          comment:
            'Yes. To hear about your innovation project! Innovation is such an exciting space to be in. My advice would be to ensure you have a diverse team with varied perspectives and skills.',
          upvotes: 2,
          downvotes: 0,
        },
      ],
      questions: [
        'Hast du in letzter Zeit Banking-Innovationen erlebt, die deine Art der Finanzverwaltung verändert haben?',
        'Wie hat die Technologie deine persönlichen Bankinteraktionen beeinflusst?',
        'Könntest du eine persönliche Geschichte über eine Bankinnovation teilen, die sich auf dich ausgewirkt hat?',
      ],
    },
  ],
};

export const project_colaboration: any = {
  projectName: 'TruBudget',
  writeCommentText:
    'Teil deine Ratschläge und Gedanken zu diesem Thema, damit deine Kollegen von deiner Expertise profitieren können.',
  surveyQuestions: [
    {
      question: '1. Welche Methode bevorzugt ihr für das XYZ Verfahren',
      responseOptions: ['Usability testing', 'Monitoring', '101 Interview', 'Interviews'],
      votes: 54,
    },
  ],
  projectUpdates: [
    {
      headline: 'Welche spannende Use Cases für Künstliche Intelligenz kennt ihr aus anderen Unternehmen?',
      text: 'Haben die Anwendungsfälle einen signifikanten Mehrwert geleistet? Helft uns indem ihr Eure Erfahrungen und Euer Wissen  mit uns teilt!',
      requiredBy: [
        {
          name: 'Willem Behrenbeck',
          role: 'Data Scientist',
          avatar: avatarSusanImg,
        },
        {
          name: 'Melanie Muster',
          role: 'Junior Scientist',
          avatar: avatarMelanieImg,
        },
      ],
      comments: [
        {
          id: 1,
          author: {
            name: 'Jure Zakotnik',
            role: 'KI Experte',
            avatar: avatarMaxImg,
          },
          comment:
            'Hallo zusammen, ich kenne einen Use Case von einem Mittelständler in Frankfurt. Bei diesem überprüft die KI die Datenbanken hinsichtlich Inkonsistenten und fehlerhaten Einträgen. Die KI überarbeitet die Datenbanken automatisiert oder legt dem Sachbearbeiter die Stammdaten zur Prüfung vor. Das wäre sicherlich auch spannend für ***STRING_REMOVED*** , insbesondere in Hinblick auf unsere unzähligen Daten. Ich hoffe ich konnte weiterhelfen.Macht weiter so, super spannendes Projekt!',
          upvotes: 27,
          downvotes: 0,
        },
        {
          id: 2,
          author: {
            name: 'Maurice Suiker',
            role: 'Dualer Student',
            avatar: avatarMaxImg,
          },
          comment: 'Sprecht mal mit Aleph Alpha, da ist SAP gerade eingestiegen.',
          upvotes: 2,
          downvotes: 0,
        },
        {
          id: 3,
          author: {
            name: 'Max Milian',
            role: 'Lead Scientist',
            avatar: avatarMaxImg,
          },
          comment: 'Ruft mich mal an, dann sprechen wir darüber.',
          upvotes: 2,
          downvotes: 0,
        },
        {
          id: 4,
          author: {
            name: 'Max Milian',
            role: 'Lead Scientist',
            avatar: avatarMaxImg,
          },
          comment: 'Ich habe Euch einen Termin eingestellt, freue mich darauf.',
          upvotes: 2,
          downvotes: 0,
        },
      ],
    },
    {
      headline: 'Welche eurer täglichen Herausforderungen könnten durch den Einsatz von KI gelöst werden?',
      text: 'Helft uns indem ihr Eure Erfahrungen und Euer Wissen  mit uns teilt!',
      requiredBy: [
        {
          name: 'Melanie Muster',
          role: 'Junior Scientist',
          avatar: avatarMelanieImg,
        },
      ],
      comments: [
        {
          id: 1,
          author: {
            name: 'Robin Hertz',
            role: 'Teamleiter',
            avatar: avatarMaxImg,
          },
          comment:
            'Hallo liebes Team, ich bin Teamleiter im Bereich OS. Bei uns liegen jeden Tag  so viele Anträge auf dem Tisch,dass wir kaum noch hinterher kommen. Das führt natürlich zu langen Wartezeiten und Frust bei unseren Kunden. KI könnte uns hier einen Teil der Arbeit abnehmen, in dem sie die Anträge schonmal vorab prüft und auf plausbilität untersucht. Das wäre eine mega Erleichterung für uns. Ich hoffe das hilft euch weiter. Haltet uns bitte auf dem Laufenden!',
          upvotes: 27,
          downvotes: 0,
        },
        {
          id: 2,
          author: {
            name: 'Felix Stark',
            role: 'Energiewende-Enthusiast',
            avatar: avatarMaxImg,
          },
          comment:
            'Ich hatte schon spannende Gespräche mit Ki-Zentralverband und würde gerne bei Euch mitarbeiten. Lasst uns mal sprechen.',
          upvotes: 2,
          downvotes: 0,
        },
      ],
    },
    {
      headline: 'Welche Bedenken habt ihr hinsichtlich des Einsatzes von KI, in eurem Bereich?',
      text: '',
      requiredBy: [],
      comments: [],
    },
  ],
};

export const project_updates: any[] = [
  {
    projectId: 1,
    updates: [
      {
        id: 1,
        author: {
          name: 'Martha Viatowsky',
          role: 'Senior Analyst',
          avatar: avatarMelanieImg,
        },
        date: '4. Jul 2023',
        comment:
          'Wir arbeiten hinter den Kulissen fleißig daran, unser Angebot für dich zu optimieren. Bleib dran, um bald mehr zu erfahren!',
      },
      {
        id: 2,
        author: {
          name: 'Martha Viatowsky',
          role: 'Senior Analyst',
          avatar: avatarMelanieImg,
        },
        date: '12. Jun 2023',
        comment:
          'Wir arbeiten hinter den Kulissen fleißig daran, unser Angebot für dich zu optimieren. Bleib dran, um bald mehr zu erfahren!',
      },
      {
        id: 3,
        author: {
          name: 'Martha Viatowsky',
          role: 'Senior Analyst',
          avatar: avatarMelanieImg,
        },
        date: '8. Jun 2023',
        comment:
          'Wir arbeiten hinter den Kulissen fleißig daran, unser Angebot für dich zu optimieren. Bleib dran, um bald mehr zu erfahren!',
      },
      {
        id: 4,
        author: {
          name: 'Martha Viatowsky',
          role: 'Senior Analyst',
          avatar: avatarMelanieImg,
        },
        date: '30. Mai 2023',
        comment:
          'Wir arbeiten hinter den Kulissen fleißig daran, unser Angebot für dich zu optimieren. Bleib dran, um bald mehr zu erfahren!',
      },
      {
        id: 5,
        author: {
          name: 'Martha Viatowsky',
          role: 'Senior Analyst',
          avatar: avatarMelanieImg,
        },
        date: '2. Feb 2023',
        comment:
          'Wir arbeiten hinter den Kulissen fleißig daran, unser Angebot für dich zu optimieren. Bleib dran, um bald mehr zu erfahren!',
      },
      {
        id: 6,
        author: {
          name: 'Martha Viatowsky',
          role: 'Senior Analyst',
          avatar: avatarMelanieImg,
        },
        date: '15. Jan 2023',
        comment:
          'Wir arbeiten hinter den Kulissen fleißig daran, unser Angebot für dich zu optimieren. Bleib dran, um bald mehr zu erfahren!',
      },
      {
        id: 7,
        author: {
          name: 'Martha Viatowsky',
          role: 'Senior Analyst',
          avatar: avatarMelanieImg,
        },
        date: '16. Dez 2022',
        comment:
          'Wir arbeiten hinter den Kulissen fleißig daran, unser Angebot für dich zu optimieren. Bleib dran, um bald mehr zu erfahren!',
      },
      {
        id: 8,
        projectStart: true,
        author: {
          name: 'Martha Viatowsky',
          role: 'Senior Analyst',
          avatar: avatarMelanieImg,
        },
        date: '25. Nov 2022',
        comment:
          'Wir arbeiten hinter den Kulissen fleißig daran, unser Angebot für dich zu optimieren. Bleib dran, um bald mehr zu erfahren!',
      },
    ],
  },
];
