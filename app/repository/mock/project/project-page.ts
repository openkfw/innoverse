import { PROJECT_PROGRESS } from '../landing/project-section';

import avatarImg from '/public/images/avatar.png';
import featured_project from '/public/images/featured_project.png';

//TODO: define types after ui is implemented - there might be some changes
export const project_progression = [
  {
    projectId: 1,
    hero: {
      image: featured_project,
      title: 'Generative KI für ***STRING_REMOVED***  nutzen',
      author: {
        name: 'Ingmar Müller',
        role: 'Innovation Hub',
        avatar: avatarImg,
      },
      project_status: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
    },
    projectSummary: {
      state: {
        project_status: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
        start_date: 'Okt 2022',
        end_date: 'Nov 2023',
        summary:
          'Die Innovationsplattform ist der zentrale Ort für alle ***STRING_REMOVED*** ler, um sich über Innovation in ***STRING_REMOVED***  zu informieren und sich aktiv einzubringen.',
        collaboration: {
          summary:
            'Dein Feedback ist uns sehr wichtig. Bitte teile uns deine Gedanken, Anregungen und Ideen mit. Gemeinsam können wir großartige Veränderungen bewirken.',
          upvotes: 54,
          comments: 14,
        },
        team_members: [
          {
            name: 'Willem Behrenbeck',
            role: 'BDAI Experte',
            avatar: avatarImg,
          },
          {
            name: 'Ingmar Müller',
            role: 'Innovation Hub',
            avatar: avatarImg,
          },
          {
            name: 'Rupert Rebentisch',
            role: 'Tech Innovation Champion',
            avatar: avatarImg,
          },
        ],
      },
      updates: [
        {
          name: 'Rupert Rebentisch',
          avatar: avatarImg,
          posted_on: '12. Aug 2023',
          content:
            'Wir haben unsere Ergebnisse dem Vorstand präsentiert, sehr gute Diskussion und viel Unterstützung - jetzt kanns losgehen',
        },
        {
          name: 'Willem Behrenbeck',
          avatar: avatarImg,
          posted_on: '4. Jul 2023',
          content:
            'Wir haben jetzt ein Konzept erstellt, um Generative KI in ***STRING_REMOVED***  zu ermöglichen',
        },
        {
          name: 'Ingmar Müller',
          avatar: avatarImg,
          posted_on: '12. Jul 2023',
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
        avatar: avatarImg,
        points: 536,
        department: 'Department ABC, Frankfurt am Main',
      },
      tags: ['Gesellschaft', 'Bildung', 'Gründen', 'AI'],
    },
    comments: [
      {
        author: {
          name: 'Melanie Muster',
          role: 'Junior Scientist',
          avatar: avatarImg,
        },
        comment:
          "I'm thrilled to hear about your innovation project! Innovation is such an exciting space to be in. My advice would be to ensure you have a diverse team with varied perspectives and skills om different anom different anom different an. This can lead to more creative solutions and help you anticipate challenges from different angles. Also, consider creating a culture of experimentation and learning from failures. It's often in our failures that we find the seeds of great innovation. This ca ... alles anzeigen",
        upvotes: 15,
      },
      {
        author: {
          name: 'Melanie Muster',
          role: 'Junior Scientist',
          avatar: avatarImg,
        },
        comment:
          'Yes. To hear about your innovation project! Innovation is such an exciting space to be in. My advice would be to ensure you have a diverse team with varied perspectives and skills.',
        upvotes: 2,
      },
    ],
  },
  {
    projectId: 2,
    hero: {
      image: featured_project,
      title: 'Innovationsplattform',
      author: {
        name: 'Susanne Grün',
        role: 'Senior Scientist',
        avatar: avatarImg,
      },
      project_status: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
    },
    projectSummary: {
      state: {
        project_status: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
        start_date: 'Okt 2022',
        end_date: 'Nov 2023',
        summary:
          'Die Innovationsplattform ist der zentrale Ort für alle ***STRING_REMOVED*** ler, um sich über Innovation in ***STRING_REMOVED***  zu informieren und sich aktiv einzubringen.',
        collaboration: {
          summary:
            'Dein Feedback ist uns sehr wichtig. Bitte teile uns deine Gedanken, Anregungen und Ideen mit. Gemeinsam können wir großartige Veränderungen bewirken.',
          upvotes: 54,
          comments: 14,
        },
        team_members: [
          {
            name: 'Max Muster',
            role: 'Junior Scientist',
            avatar: avatarImg,
          },
          {
            name: 'Lisa Laimberger',
            role: 'Senior Scientist',
            avatar: avatarImg,
          },
          {
            name: 'Bernhard Brunner',
            role: 'Senior Scientist',
            avatar: avatarImg,
          },
        ],
      },
      updates: [
        {
          name: 'Martha Viatowsky',
          avatar: avatarImg,
          posted_on: '12. Aug 2023',
          content:
            'Bleib gespannt auf bevorstehende Ankündigungen und Überraschungen. Wir können es kaum erwarten, zu teilen, was auf dich wartet. Sei bereit für etwas 🚀',
        },
        {
          name: 'Tony Hawk',
          avatar: avatarImg,
          posted_on: '4. Jul 2023',
          content:
            'Wir arbeiten hinter den Kulissen fleißig daran, unser Angebot für dich zu optimieren. Bleib dran, um bald mehr zu erfahren!',
        },
        {
          name: 'Tony Hawk',
          avatar: avatarImg,
          posted_on: '12. Aug 2023',
          content:
            'Wir arbeiten hinter den Kulissen fleißig daran, unser Angebot für dich zu optimieren. Bleib dran, um bald mehr zu erfahren!',
        },
      ],
    },
    projectStatus: {
      text: '',
      author: {
        name: 'Max Muster',
        role: 'Junior Scientist',
        avatar: avatarImg,
        points: 536,
        department: 'Department ABC, Frankfurt am Main',
      },
      tags: ['Gesellschaft', 'Bildung', 'Gründen', 'AI'],
    },
    comments: [
      {
        author: {
          name: 'Melanie Muster',
          role: 'Junior Scientist',
          avatar: avatarImg,
        },
        comment:
          "I'm thrilled to hear about your innovation project! Innovation is such an exciting space to be in. My advice would be to ensure you have a diverse team with varied perspectives and skills om different anom different anom different an. This can lead to more creative solutions and help you anticipate challenges from different angles. Also, consider creating a culture of experimentation and learning from failures. It's often in our failures that we find the seeds of great innovation. This ca ... alles anzeigen",
        upvotes: 15,
      },
      {
        author: {
          name: 'Melanie Muster',
          role: 'Junior Scientist',
          avatar: avatarImg,
        },
        comment:
          'Yes. To hear about your innovation project! Innovation is such an exciting space to be in. My advice would be to ensure you have a diverse team with varied perspectives and skills.',
        upvotes: 2,
      },
    ],
  },

  {
    projectId: 3,
    hero: {
      image: featured_project,
      title: 'Innovationsplattform',
      author: {
        name: 'Susanne Grün',
        role: 'Senior Scientist',
        avatar: avatarImg,
      },
      project_status: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
    },
    projectSummary: {
      state: {
        project_status: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
        start_date: 'Okt 2022',
        end_date: 'Nov 2023',
        summary:
          'Die Innovationsplattform ist der zentrale Ort für alle ***STRING_REMOVED*** ler, um sich über Innovation in ***STRING_REMOVED***  zu informieren und sich aktiv einzubringen.',
        collaboration: {
          summary:
            'Dein Feedback ist uns sehr wichtig. Bitte teile uns deine Gedanken, Anregungen und Ideen mit. Gemeinsam können wir großartige Veränderungen bewirken.',
          upvotes: 54,
          comments: 14,
        },
        team_members: [
          {
            name: 'Max Muster',
            role: 'Junior Scientist',
            avatar: avatarImg,
          },
          {
            name: 'Lisa Laimberger',
            role: 'Senior Scientist',
            avatar: avatarImg,
          },
          {
            name: 'Bernhard Brunner',
            role: 'Senior Scientist',
            avatar: avatarImg,
          },
        ],
      },
      updates: [
        {
          name: 'Martha Viatowsky',
          avatar: avatarImg,
          posted_on: '12. Aug 2023',
          content:
            'Bleib gespannt auf bevorstehende Ankündigungen und Überraschungen. Wir können es kaum erwarten, zu teilen, was auf dich wartet. Sei bereit für etwas 🚀',
        },
        {
          name: 'Tony Hawk',
          avatar: avatarImg,
          posted_on: '4. Jul 2023',
          content:
            'Wir arbeiten hinter den Kulissen fleißig daran, unser Angebot für dich zu optimieren. Bleib dran, um bald mehr zu erfahren!',
        },
        {
          name: 'Tony Hawk',
          avatar: avatarImg,
          posted_on: '12. Aug 2023',
          content:
            'Wir arbeiten hinter den Kulissen fleißig daran, unser Angebot für dich zu optimieren. Bleib dran, um bald mehr zu erfahren!',
        },
      ],
    },
    projectStatus: {
      text: '',
      author: {
        name: 'Max Muster',
        role: 'Junior Scientist',
        avatar: avatarImg,
        points: 536,
        department: 'Department ABC, Frankfurt am Main',
      },
      tags: ['Gesellschaft', 'Bildung', 'Gründen', 'AI'],
    },
    comments: [
      {
        author: {
          name: 'Melanie Muster',
          role: 'Junior Scientist',
          avatar: avatarImg,
        },
        comment:
          "I'm thrilled to hear about your innovation project! Innovation is such an exciting space to be in. My advice would be to ensure you have a diverse team with varied perspectives and skills om different anom different anom different an. This can lead to more creative solutions and help you anticipate challenges from different angles. Also, consider creating a culture of experimentation and learning from failures. It's often in our failures that we find the seeds of great innovation. This ca ... alles anzeigen",
        upvotes: 15,
      },
      {
        author: {
          name: 'Melanie Muster',
          role: 'Junior Scientist',
          avatar: avatarImg,
        },
        comment:
          'Yes. To hear about your innovation project! Innovation is such an exciting space to be in. My advice would be to ensure you have a diverse team with varied perspectives and skills.',
        upvotes: 2,
      },
    ],
  },
];

export const project_cooperation = {
  project_updates: [
    {
      headline: 'First Question about some topics I need advice',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      required_by: [
        {
          name: 'Susan Brown',
          role: 'Lead Scientist',
          avatar: avatarImg,
        },
        {
          name: 'Melanie Muster',
          role: 'Junior Scientist',
          avatar: avatarImg,
        },
      ],
      comments: [
        {
          author: {
            name: 'Melanie Muster',
            role: 'Junior Scientist',
            avatar: avatarImg,
          },
          comment:
            "I'm thrilled to hear about your innovation project! Innovation is such an exciting space to be in. My advice would be to ensure you have a diverse team with varied perspectives and skills. This can lead to more creative solutions and help you anticipate challenges from different angles. Also, consider creating a culture of experimentation and learning from failures. It's often in our failures that we find the seeds of great innovation. This ca ... alles anzeigen",
          upvotes: 27,
        },
        {
          author: {
            name: 'Max Milian',
            role: 'Lead Scientist',
            avatar: avatarImg,
          },
          comment:
            "Response 6: Greetings,Innovation projects thrive on creativity and collaboration. I recommend fostering a culture of brainstorming and idea-sharing within your team. Sometimes, the most innovative solutions emerge from unexpected sources. Also, don't be afraid to seek feedback and critique from outside experts or customers to refine your ideas further. Best of luck!",
          upvotes: 2,
        },
      ],
    },
  ],
};
