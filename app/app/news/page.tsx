import Image from 'next/image';

import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import BreadcrumbsNav from '@/components/common/BreadcrumbsNav';
import ErrorPage from '@/components/error/ErrorPage';
import NewsContainer from '@/components/newsPage/NewsContainer';
import { getProjectUpdates, getProjectUpdatesPage } from '@/utils/requests/updates/requests';

import { NewsFilterContextProvider } from '../contexts/news-filter-context';

import backgroundImage from '/public/images/news-background.png';

async function NewsPage() {
  const initialUpdates = (await getProjectUpdatesPage({ filters: { projects: [], topics: [] }, page: 1 })) ?? [];
  const allUpdates = await getProjectUpdates();

  if (!initialUpdates || !allUpdates) return <ErrorPage />;

  return (
    <Stack spacing={8} useFlexGap>
      <Image
        src={backgroundImage}
        alt="news-background"
        sizes="33vw"
        style={{
          position: 'absolute',
          width: '100%',
          height: 264,
          background: `lightgray 50% / cover no-repeat`,
          mixBlendMode: 'plus-lighter',
        }}
      />
      <Container>
        <Box style={{ position: 'relative' }}>
          <BreadcrumbsNav activePage="News" />
        </Box>
        <Grid container sx={containerStyles}>


        <Card sx={cardStylesUpdate}>
            <Icon
              style={{
                color: 'white',
                width: '16',
                height: '16',
              }}><RefreshOutlinedIcon /></Icon>
            <Typography variant='subtitle1'>7 neue Updates verfügbar</Typography>
            <Link 
            style={{
              color: '#B7F9AA',
              textDecoration: 'underline',
            }}
            /*
            onClick={() => {
              console.log('Link clicked!');
            }}
              */
            >Jetzt zeigen</Link>
        </Card>
            


          <Card sx={cardStyles}>
            <Typography variant="h2" sx={cardTitleStyles}>
              News
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, fontSize: { lg: 24, sm: 22, xs: 16 } }}>
              Die Neuigkeiten im Überblick: Aktuelle Nachrichten zu unseren Projekten auf der Innovationsplattform
            </Typography>
          </Card>
        </Grid>
        <NewsFilterContextProvider initiallyLoadedNews={initialUpdates} allNews={allUpdates}>
          <NewsContainer news={initialUpdates} />
        </NewsFilterContextProvider>
      </Container>
    </Stack>
  );
}

const cardStyles = {
  padding: '32px 24px',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.20)',
  backgroundColor: 'rgba(255, 255, 255, 0.10)',
  boxShadow: '0px 12px 40px 0px rgba(0, 0, 0, 0.25)',
  backdropFilter: 'blur(20px)',
  width: 620,
  height: 200,
  ml: { lg: -4, md: -4, sm: 0 },
};

const cardStylesUpdate = {
  display: 'flex',
  padding: '24px 16px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  borderRadius: '16px',
  border: '1px solid rgba(183, 249, 170, 0.80)',
  backgroundColor: 'rgba(255, 255, 255, 0.20)',
  boxShadow: '0px 12px 40px 0px rgba(0, 0, 0, 0.25)',
  backdropFilter: 'blur(20px)',
  width: 761,
  height: 76,
};


const cardTitleStyles = {
  fontSize: '48px',
};

const containerStyles = {
  position: 'relative',
  justifyItems: 'center',
  alignItems: 'center',
};

export default NewsPage;
