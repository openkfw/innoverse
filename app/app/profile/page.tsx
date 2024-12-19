import Image from 'next/image';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import BreadcrumbsNav from '@/components/common/BreadcrumbsNav';
import UserInfo from '@/components/userProfile/UserInfo';
import * as m from '@/src/paraglide/messages.js';

import backgroundImage from '/public/images/news-background.png';

export const dynamic = 'force-dynamic';

async function UserProfilePage() {
  return (
    <Stack spacing={8} useFlexGap direction="column">
      <Image
        src={backgroundImage}
        alt={m.app_news_page_imageAlt()}
        width={1792}
        height={1024}
        style={{
          position: 'fixed',
          width: '100%',
          height: 264,
          zIndex: -1,
          background: `lightgray 50% / cover no-repeat`,
          mixBlendMode: 'plus-lighter',
        }}
      />
      <Container>
        <Box style={{ position: 'relative' }}>
          <BreadcrumbsNav activePage={m.app_user_profile()} />
        </Box>

        <UserInfo />
      </Container>
    </Stack>
  );
}

export default UserProfilePage;
