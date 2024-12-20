import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import CustomToast from '@/components/common/CustomToast';
import ErrorPage from '@/components/error/ErrorPage';
import { EventSection } from '@/components/landing/eventsSection/EventsSection';
import FeaturedProjectSlider from '@/components/landing/featuredProjectSection/FeaturedProjectSlider';
import FeedbackSection from '@/components/landing/feedbackSection/FeedbackSection';
import { MappingProjectsCard } from '@/components/landing/mappingProjectsSection/MappingProjectsCard';
import { NewsSection } from '@/components/landing/newsSection/NewsSection';
import { ProjectSection } from '@/components/landing/projectSection/ProjectSection';
import { getMainPageData } from '@/utils/requests/pageRequests';

export const dynamic = 'force-dynamic';

async function IndexPage() {
  // As the page is not staticaly generated and no ISR is used here fetch is required
  const data = await getMainPageData();

  if (!data || !data.projects?.length || !data.sliderContent?.length) {
    return <ErrorPage />;
  }

  const sliderContent = data.sliderContent;
  const projects = data.projects;
  const updates = data.updates;
  const events = data.events;

  return (
    <>
      <Stack spacing={8} useFlexGap sx={{ gap: { xs: 0 }, overflowX: 'hidden' }}>
        <FeaturedProjectSlider items={sliderContent} />
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <FeedbackSection />
        </Box>
        <NewsSection updates={updates} />
        <EventSection events={events} />
        <ProjectSection projects={projects} />
        <MappingProjectsCard projects={projects} />
      </Stack>
      <CustomToast />
    </>
  );
}

export default IndexPage;
