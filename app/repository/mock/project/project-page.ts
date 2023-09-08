import { PROJECT_PROGRESS, ProjectColaboration, ProjectProgression } from '@/common/types';

import avatarMaxImg from '/public/images/avatarMax.png';
import avatarMelanieImg from '/public/images/avatarMelanie.png';
import avatarSusanImg from '/public/images/avatarSusan.png';
import avatarTonyImg from '/public/images/avatarTony.png';
import featured_project from '/public/images/featured_project.png';

//TODO: define types after ui is implemented - there might be some changes
export const project_progression: ProjectProgression = {
  hero: {
    image: featured_project,
    title: 'The most talked-about, futuristic product',
    author: {
      name: 'Susanne Grün',
      role: 'Senior Scientist',
    },
    projectStatus: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
  },
  projectSummary: {
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
        name: 'Anna Schwarz',
        avatar: avatarMelanieImg,
        role: 'Junior Consultant',
      },
      {
        name: 'Tony Hawk',
        avatar: avatarTonyImg,
        role: 'Junior Consultant',
      },
      {
        name: 'Anna Schwarz',
        avatar: avatarMelanieImg,
        role: 'Junior Consultant',
      },
      {
        name: 'Tony Hawk',
        avatar: avatarTonyImg,
        role: 'Junior Consultant',
      },
      {
        name: 'Anna Schwarz',
        avatar: avatarMelanieImg,
        role: 'Junior Consultant',
      },
    ],
    updates: [
      {
        author: {
          name: 'Anna Schwarz',
          avatar: avatarMelanieImg,
          role: 'Junior Consultant',
        },
        content:
          'Bleib gespannt auf bevorstehende Ankündigungen und Überraschungen. Wir können es kaum erwarten, zu teilen, was auf dich wartet. Sei bereit für etwas 🚀',
        date: '12. Aug 2023',
      },
      {
        author: {
          name: 'Tony Hawk',
          avatar: avatarTonyImg,
          role: 'Junior Consultant',
        },
        content:
          'Wir arbeiten hinter den Kulissen fleißig daran, unser Angebot für dich zu optimieren. Bleib dran, um bald mehr zu erfahren!',
        date: '4. Jul 2023',
      },
      {
        author: {
          name: 'Tony Hawk',
          avatar: avatarTonyImg,
          role: 'Junior Consultant',
        },
        content:
          'Wir arbeiten hinter den Kulissen fleißig daran, unser Angebot für dich zu optimieren. Bleib dran, um bald mehr zu erfahren!',
        date: '4. Jul 2023',
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
};

export const project_colaboration: ProjectColaboration = {
  writeOpinionText:
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
