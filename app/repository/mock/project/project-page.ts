import { PROJECT_PROGRESS, ProjectColaboration, ProjectsProgression } from '@/common/types';

import TruBudget from './projects/TruBudget.md';

import avatarMaxImg from '/public/images/avatarMax.png';
import avatarMelanieImg from '/public/images/avatarMelanie.png';
import avatarSusanImg from '/public/images/avatarSusan.png';
import avatarTonyImg from '/public/images/avatarTony.png';
import featured_project from '/public/images/featured_project.png';

//TODO: define types after ui is implemented - there might be some changes
export const projects_progression: ProjectsProgression = {
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
        text: TruBudget,
        author: {
          name: 'Max Muster',
          role: 'Junior Scientist',
          avatar: avatarMaxImg,
          points: 536,
          department: 'Department ABC, Frankfurt am Main',
        },
        tags: ['Gesellschaft', 'Bildung', 'Gründen', 'AI'],
        info: {
          title: '##Blockchain',
          description: 'Die Blockchain-Technologie stellt sicher, dass keine Manipulation möglich ist.',
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

export const project_colaboration: ProjectColaboration = {
  writeCommentText:
    'Teil deine Ratschläge und Gedanken zu diesem Thema, damit deine Kollegen von deiner Expertise profitieren können.',
  projectUpdates: [
    {
      headline: 'First Question about some topics I need advice',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      requiredBy: [
        {
          name: 'Susan Brown',
          role: 'Lead Scientist',
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
            name: 'Melanie Muster',
            role: 'Junior Scientist',
            avatar: avatarMelanieImg,
          },
          comment:
            "I'm thrilled to hear about your innovation project! Innovation is such an exciting space to be in. My advice would be to ensure you have a diverse team with varied perspectives and skills. This can lead to more creative solutions and help you anticipate challenges from different angles. Also, consider creating a culture of experimentation and learning from failures. It's often in our failures that we find the seeds of great innovation.",
          upvotes: 27,
          downvotes: 0,
        },
        {
          id: 2,
          author: {
            name: 'Max Milian',
            role: 'Lead Scientist',
            avatar: avatarMaxImg,
          },
          comment:
            "Response 6: Greetings,Innovation projects thrive on creativity and collaboration. I recommend fostering a culture of brainstorming and idea-sharing within your team. Sometimes, the most innovative solutions emerge from unexpected sources. Also, don't be afraid to seek feedback and critique from outside experts or customers to refine your ideas further. Best of luck!",
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
            "Response 6: Greetings,Innovation projects thrive on creativity and collaboration. I recommend fostering a culture of brainstorming and idea-sharing within your team. Sometimes, the most innovative solutions emerge from unexpected sources. Also, don't be afraid to seek feedback and critique from outside experts or customers to refine your ideas further. Best of luck!",
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
            "Response 6: Greetings,Innovation projects thrive on creativity and collaboration. I recommend fostering a culture of brainstorming and idea-sharing within your team. Sometimes, the most innovative solutions emerge from unexpected sources. Also, don't be afraid to seek feedback and critique from outside experts or customers to refine your ideas further. Best of luck!",
          upvotes: 2,
          downvotes: 0,
        },
      ],
    },
    {
      headline: 'Second Question about some topics I need advice',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
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
            name: 'Melanie Muster',
            role: 'Junior Scientist',
            avatar: avatarMelanieImg,
          },
          comment:
            "I'm thrilled to hear about your innovation project! Innovation is such an exciting space to be in. My advice would be to ensure you have a diverse team with varied perspectives and skills. This can lead to more creative solutions and help you anticipate challenges from different angles. Also, consider creating a culture of experimentation and learning from failures. It's often in our failures that we find the seeds of great innovation.",
          upvotes: 27,
          downvotes: 0,
        },
        {
          id: 2,
          author: {
            name: 'Max Milian',
            role: 'Lead Scientist',
            avatar: avatarMaxImg,
          },
          comment:
            "Response 6: Greetings,Innovation projects thrive on creativity and collaboration. I recommend fostering a culture of brainstorming and idea-sharing within your team. Sometimes, the most innovative solutions emerge from unexpected sources. Also, don't be afraid to seek feedback and critique from outside experts or customers to refine your ideas further. Best of luck!",
          upvotes: 2,
          downvotes: 0,
        },
      ],
    },
    {
      headline: 'Third Question about some topics I need advice',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      requiredBy: [],
      comments: [],
    },
  ],
};
