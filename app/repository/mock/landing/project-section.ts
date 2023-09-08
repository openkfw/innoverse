import { StaticImageData } from 'next/image';

import { PROJECT_PROGRESS } from '@/common/types';

import project1 from '/public/images/project1.png';
import project2 from '/public/images/project2.png';
import project3 from '/public/images/project3.png';

export type ProjectCarouselItem = {
  id: number;
  image: StaticImageData;
  contributors: string[];
  progress: PROJECT_PROGRESS;
};

export const projects = [
  {
    id: 1,
    image: project1,
    contributors: ['Max Muster', 'Lisa Laimberger', 'Bernhard Brunner'],
    progress: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
  },
  {
    id: 2,
    image: project2,
    contributors: ['Max Muster', 'Lisa Laimberger'],
    progress: PROJECT_PROGRESS.KONZEPTION,
  },
  {
    id: 3,
    image: project3,
    contributors: ['Max Muster', 'Lisa Laimberger', 'Bernhard Brunner'],
    progress: PROJECT_PROGRESS.KONZEPTION,
  },
  {
    id: 4,
    image: project1,
    contributors: ['Max Muster', 'Lisa Laimberger', 'Bernhard Brunner'],
    progress: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
  },
  {
    id: 5,
    image: project2,
    contributors: ['Max Muster', 'Lisa Laimberger'],
    progress: PROJECT_PROGRESS.KONZEPTION,
  },
  {
    id: 6,
    image: project3,
    contributors: ['Max Muster', 'Lisa Laimberger', 'Bernhard Brunner'],
    progress: PROJECT_PROGRESS.KONZEPTION,
  },
];
