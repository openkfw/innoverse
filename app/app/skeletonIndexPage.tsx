import Image from 'next/image';

import Stack from '@mui/material/Stack';

import * as m from '@/src/paraglide/messages.js';

import backgroundImage from '/public/images/news-background.png';

async function SkeletonIndexPage() {
  return (
    <Stack spacing={8} useFlexGap direction="column">
      <Image
        src={backgroundImage}
        alt={m.app_news_page_imageAlt()}
        width={0}
        height={0}
        style={{
          position: 'fixed',
          width: '100%',
          height: '40%',
          zIndex: -1,
          background: `lightgray 20% / cover no-repeat`,
          mixBlendMode: 'plus-lighter',
        }}
      />
    </Stack>
  );
}

export default SkeletonIndexPage;
