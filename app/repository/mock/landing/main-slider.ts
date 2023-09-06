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
        title: 'AI Driven',
        projectFrom: 'Jan',
        projectTo: 'Feb',
        year: '2023',
      },
      text: {
        title: 'The most talked-about, futuristic product',
        tags: ['Strategy', 'AI in Finance', 'Future'],
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer gravida velit nisl, quis feugiat enim convallis ac. Integer laoreet sed urna semper sagittis. ',
      },
    },
    {
      image: {
        image: featured_project1,
        title: 'Deep Learning',
        projectFrom: 'Mar',
        projectTo: 'Jun',
        year: '2023',
      },
      text: {
        title: 'The most talked-about, futuristic product',
        tags: ['Strategy', 'AI in Finance', 'Future'],
        description:
          'Suspendisse condimentum enim nec aliquet suscipit. Pellentesque elementum diam at urna rhoncus euismod. Ut tellus ligula, ornare eu finibus at, porta et ex.',
      },
    },
    {
      image: {
        image: featured_project2,
        title: 'Social',
        projectFrom: 'Apr',
        projectTo: 'Aug',
        year: '2023',
      },
      text: {
        title: 'The most talked-about, futuristic product',
        tags: ['Strategy', 'AI in Finance', 'Future'],
        description:
          'Nullam id turpis non sem sodales gravida non at urna. Etiam in urna at leo imperdiet elementum. Cras imperdiet pulvinar dui, a consequat odio ornare eget.',
      },
    },
    {
      image: {
        image: featured_project1,
        title: 'Finance',
        projectFrom: 'Jan',
        projectTo: 'Feb',
        year: '2023',
      },
      text: {
        title: 'One of the most significant applications ',
        tags: ['Strategy', 'AI in Finance', 'Future'],
        description:
          'In conclusion, the infusion of AI into the financial sector has ushered in a new era of efficiency, accuracy, and customer-centricity.',
      },
    },
    {
      image: {
        image: featured_project,
        title: 'KI',
        projectFrom: 'Mai',
        projectTo: 'Nov',
        year: '2023',
      },
      text: {
        title: 'Generative KI für ***STRING_REMOVED***  nutzen',
        tags: ['KI', '***STRING_REMOVED***  Prozesse', 'Effizienzen'],
        description:
          'Die .',
      },
    },
  ],
};
