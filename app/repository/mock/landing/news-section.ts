import { StaticImageData } from 'next/image';
import avatarImg from '/public/images/avatar.png';

export type NewsSlider = {
  id: number;
  title: string;
  subtitle: string;
  theme: string;
  publisher: string;
  date: string;
  avatar: StaticImageData;
};

export const news = [
  {
    id: 1,
    title: 'Just the start',
    subtitle:
      'As in previous years, the company unveiled a feature before it was ready. The obvous question soon followed.',
    theme: 'AI in Finance',
    publisher: 'Muster Macintosh',
    date: '12 Sep 2023',
    avatar: avatarImg,
  },
  {
    id: 2,
    title: 'Something else',
    subtitle:
      'As in previous years, the company unveiled a feature before it was ready. The obvous question soon followed.',
    theme: 'Thema xzy',
    publisher: 'Muster Macintosh',
    date: '12 Sep 2023',
    avatar: avatarImg,
  },
  {
    id: 3,
    title: 'Just the start',
    subtitle:
      'As in previous years, the company unveiled a feature before it was ready. The obvous question soon followed.',
    theme: 'AI in Finance',
    publisher: 'Muster Macintosh',

    date: '12 Sep 2023',
    avatar: avatarImg,
  },
  {
    id: 4,
    title: 'Something else',
    subtitle:
      'As in previous years, the company unveiled a feature before it was ready. The obvous question soon followed.',
    theme: 'Thema xzy',
    publisher: 'Muster Macintosh',
    date: '12 Sep 2023',
    avatar: avatarImg,
  },
  {
    id: 5,
    title: 'Just the start',
    subtitle:
      'As in previous years, the company unveiled a feature before it was ready. The obvous question soon followed.',
    theme: 'AI in Finance',
    publisher: 'Muster Macintosh',
    date: '12 Sep 2023',
    avatar: avatarImg,
  },
  {
    id: 6,
    title: 'Something else',
    subtitle:
      'As in previous years, the company unveiled a feature before it was ready. The obvous question soon followed.',
    theme: 'Thema xzy',
    publisher: 'Muster Macintosh',
    date: '12 Sep 2023',
    avatar: avatarImg,
  },
];
