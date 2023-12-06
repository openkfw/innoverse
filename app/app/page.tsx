import Stack from '@mui/material/Stack';

import { MainPageData } from '@/common/types';
import ErrorPage from '@/components/error/ErrorPage';
import FeaturedProjectSlider from '@/components/landing/featuredProjectSection/FeaturedProjectSlider';
import FeedbackSection from '@/components/landing/feedbackSection/FeedbackSection';
import { MappingProjectsCard } from '@/components/landing/mappingProjectsSection/MappingProjectsCard';
import { BackgroundArrows } from '@/components/landing/newsSection/BackgroundArrows';
import { NewsSection } from '@/components/landing/newsSection/NewsSection';
import { ProjectSection } from '@/components/landing/projectSection/ProjectSection';
import { getFeaturedProjects } from '@/utils/requests';

import Layout from '../components/layout/Layout';

async function IndexPage() {
  // As the page is not staticaly generated and no ISR is used here fetch is required
  const data = (await getFeaturedProjects()) as MainPageData;
  const sliderContent = data?.sliderContent;
  const projects = data?.projects;
  const updates = data?.updates;

  if (!sliderContent || !projects || !updates) {
    return <ErrorPage />;
  }

  return (
    <Layout>
      <Stack spacing={8} useFlexGap>
        <FeaturedProjectSlider items={sliderContent} />
        <FeedbackSection />
        <div style={{ position: 'relative' }}>
          <NewsSection updates={updates} />
          <BackgroundArrows />
        </div>
        <ProjectSection projects={projects} />
        <MappingProjectsCard projects={projects} />
      </Stack>
    </Layout>
  );
}

export default IndexPage;
