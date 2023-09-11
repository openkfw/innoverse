import { PROJECT_PROGRESS, ProjectColaboration, ProjectProgression } from '@/common/types';

import GenerativeAI from './projects/GenerativeAI.md';

import avatarMaxImg from '/public/images/avatarMax.png';
import avatarMelanieImg from '/public/images/avatarMelanie.png';
import avatarSusanImg from '/public/images/avatarSusan.png';
import avatarTonyImg from '/public/images/avatarTony.png';
import featured_project from '/public/images/featured_project.png';

//TODO: define types after ui is implemented - there might be some changes
export const project_progression: ProjectProgression[] = [
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
      summary:
        '',
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
            role: '',
          },
          date: '12. Aug 2023',
          content:
            'Wir haben unsere Ergebnisse dem Vorstand präsentiert, sehr gute Diskussion und viel Unterstützung - jetzt kanns losgehen!',
        },
        {
          author: {
            name: 'Willem Behrenbeck',
            avatar: avatarTonyImg,
            role: '',
          },
          date: '20. Jul 2023',
          content: 'Wir haben jetzt ein Konzept erstellt, um Generative KI in ***STRING_REMOVED***  zu ermöglichen.',
        },
        {
          author: {
            name: 'Ingmar Müller',
            avatar: avatarMaxImg,
            role: '',
          },
          date: '12. Jul 2023',
          content: 'Wir haben heute dem Bereich BR eine Einführung in KI und Generative KI gegeben - hat Spaß gemacht!',
        },
      ],
    },
    projectStatus: {
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
        title: '##Blockchain',
        description: 'Die Blockchain-Technologie stellt sicher, dass keine Manipulation möglich ist.',
      },
    },
    comments: [
      {
        id: 1,
        author: {
          name: 'Melanie Muster',
          role: 'Junior Scientist',
          avatar: avatarMelanieImg,
        },
        comment:
          "I'm thrilled to hear about your innovation project! Innovation is such an exciting space to be in. My advice would be to ensure you have a diverse team with varied perspectives and skills om different anom different anom different an. This can lead to more creative solutions and help you anticipate challenges from different angles. Also, consider creating a culture of experimentation and learning from failures. It's often in our failures that we find the seeds of great innovation. This ca ... alles anzeigen",
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
            role: '',
          },
          date: '12. Aug 2023',
          content:
            'Wir haben unsere Ergebnisse dem Vorstand präsentiert, sehr gute Diskussion und viel Unterstützung - jetzt kanns losgehen',
        },
        {
          author: {
            name: 'Willem Behrenbeck',
            avatar: avatarTonyImg,
            role: '',
          },
          date: '4. Jul 2023',
          content: 'Wir haben jetzt ein Konzept erstellt, um Generative KI in ***STRING_REMOVED***  zu ermöglichen',
        },
        {
          author: {
            name: 'Ingmar Müller',
            avatar: avatarMaxImg,
            role: '',
          },
          date: '12. Jul 2023',
          content: 'Wir haben heute dem Bereich BR eine Einführung in KI und Generative KI gegeben - hat Spaß gemacht!',
        },
      ],
    },
    projectStatus: {
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
        title: '',
        description: '',
      },
    },
    comments: [
      {
        id: 1,
        author: {
          name: 'Melanie Muster',
          role: 'Junior Scientist',
          avatar: avatarMelanieImg,
        },
        comment:
          "I'm thrilled to hear about your innovation project! Innovation is such an exciting space to be in. My advice would be to ensure you have a diverse team with varied perspectives and skills om different anom different anom different an. This can lead to more creative solutions and help you anticipate challenges from different angles. Also, consider creating a culture of experimentation and learning from failures. It's often in our failures that we find the seeds of great innovation. This ca ... alles anzeigen",
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
            role: '',
          },
          date: '12. Aug 2023',
          content:
            'Wir haben unsere Ergebnisse dem Vorstand präsentiert, sehr gute Diskussion und viel Unterstützung - jetzt kanns losgehen',
        },
        {
          author: {
            name: 'Willem Behrenbeck',
            avatar: avatarMaxImg,
            role: '',
          },
          date: '4. Jul 2023',
          content: 'Wir haben jetzt ein Konzept erstellt, um Generative KI in ***STRING_REMOVED***  zu ermöglichen',
        },
        {
          author: {
            name: 'Ingmar Müller',
            avatar: avatarMaxImg,
            role: '',
          },
          date: '12. Jul 2023',
          content: 'Wir haben heute dem Bereich BR eine Einführung in KI und Generative KI gegeben - hat Spaß gemacht!',
        },
      ],
    },
    projectStatus: {
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
        title: '',
        description: '',
      },
    },
    comments: [
      {
        id: 1,
        author: {
          name: 'Melanie Muster',
          role: 'Junior Scientist',
          avatar: avatarMelanieImg,
        },
        comment:
          "I'm thrilled to hear about your innovation project! Innovation is such an exciting space to be in. My advice would be to ensure you have a diverse team with varied perspectives and skills om different anom different anom different an. This can lead to more creative solutions and help you anticipate challenges from different angles. Also, consider creating a culture of experimentation and learning from failures. It's often in our failures that we find the seeds of great innovation. This ca ... alles anzeigen",
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
  },
];

export const project_colaboration: ProjectColaboration = {
  writeOpinionText:
    'Teil deine Ratschläge und Gedanken zu diesem Thema, damit deine Kollegen von deiner Expertise profitieren können.',
  projectUpdates: [
    {
      headline: 'Welche spannende Use Cases für Künstliche Intelligenz kennt ihr aus anderen Unternehmen?',
      text: 'Haben die Anwendungsfälle einen signifikanten Mehrwert geleistet? Helft uns in dem ihr Eure Erfahrungen und Euer Wissen  mit uns teilt!',
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
            role: 'Junior Scientist',
            avatar: avatarMaxImg,
          },
          comment:
            "Hallo zusammen, ich kenne einen Use Case von einem Mittelständler in Frankfurt. Bei diesem überprüft die KI die Datenbanken hinsichtlich Inkonsistenten und fehlerhaten Einträgen. Die KI überarbeitet die Datenbanken automatisiert oder legt dem Sachbearbeiter die Stammdaten zur Prüfung vor. Das wäre sicherlich auch spannend für ***STRING_REMOVED*** , insbesondere in Hinblick auf unsere unzähligen Daten. Ich hoffe ich konnte weiterhelfen.Macht weiter so, super spannendes Projekt!",
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
          comment:
            "Sprecht mal mit Aleph Alpha, da ist SAP gerade eingestiegen.",
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
          comment:
          "Ruft mich mal an, dann sprechen wir darüber.",
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
          comment:
          "Ich habe Euch einen Termin eingestellt, freue mich darauf.",
          upvotes: 2,
          downvotes: 0,
        },
      ],
    },
    {
      headline: 'Welche eurer täglichen Herausforderungen könnten durch den Einsatz von KI gelöst werden?',
      text: 'Helft uns in dem ihr Eure Erfahrungen und Euer Wissen  mit uns teilt!',
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
            "Hallo liebes Team, ich bin Teamleiter im Bereich OS. Bei uns liegen jeden Tag  so viele Anträge auf dem Tisch,dass wir kaum noch hinterher kommen. Das führt natürlich zu langen Wartezeiten und Frust bei unseren Kunden. KI könnte uns hier einen Teil der Arbeit abnehmen, in dem sie die Anträge schonmal vorab prüft und auf plausbilität untersucht. Das wäre eine mega Erleichterung für uns. Ich hoffe das hilft euch weiter. Haltet uns bitte auf dem Laufenden!",
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
            "Ich hatte schon spannende Gespräche mit Ki-Zentralverband und würde gerne bei Euch mitarbeiten. Lasst uns mal sprechen.",
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
