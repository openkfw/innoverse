// eslint-disable-next-line no-restricted-imports
import { Stack } from '@mui/material';
// eslint-disable-next-line no-restricted-imports
import Box from '@mui/material/Box/Box';

import { MainPageData } from '@/common/types';
import CustomToast from '@/components/common/CustomToast';
import ErrorPage from '@/components/error/ErrorPage';
import { EventSection } from '@/components/landing/eventsSection/EventsSection';
import FeaturedProjectSlider from '@/components/landing/featuredProjectSection/FeaturedProjectSlider';
import FeedbackSection from '@/components/landing/feedbackSection/FeedbackSection';
import { MappingProjectsCard } from '@/components/landing/mappingProjectsSection/MappingProjectsCard';
import { BackgroundArrows } from '@/components/landing/newsSection/BackgroundArrows';
import { NewsSection } from '@/components/landing/newsSection/NewsSection';
import { ProjectSection } from '@/components/landing/projectSection/ProjectSection';
import Layout from '@/components/layout/Layout';
import { getMainPageData } from '@/utils/requests';

async function IndexPage() {
  const data = (await getMainPageData()) as MainPageData;

  if (!data || !data.projects || !data.sliderContent) {
    return <ErrorPage />;
  }

  const sliderContent = data.sliderContent;
  const projects = data.projects;
  const updates = data.updates;
  const events = data.events;

  return (
    <Layout>
      <Stack spacing={8} useFlexGap sx={{ gap: { xs: 0 } }}>
        <FeaturedProjectSlider items={sliderContent} />
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <FeedbackSection />
        </Box>
        <div style={{ position: 'relative' }}>
          <NewsSection updates={updates} />
          <BackgroundArrows />
        </div>
        <EventSection events={events} />
        <ProjectSection projects={projects} />
        <Box>
          <MappingProjectsCard projects={projects} />
        </Box>
      </Stack>
      <CustomToast />
    </Layout>
  );
}

export default IndexPage;
