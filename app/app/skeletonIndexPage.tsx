import Stack from '@mui/material/Stack';

import { MainPageData } from '@/common/types';
import ErrorPage from '@/components/error/ErrorPage';
import FeaturedProjectSlider from '@/components/landing/featuredProjectSection/FeaturedProjectSlider';
import { NewsSection } from '@/components/landing/newsSection/NewsSection';
import { getFeaturedProjects } from '@/utils/requests';

import Layout from '../components/layout/Layout';

async function SkeletonIndexPage() {
  const data = (await getFeaturedProjects()) as MainPageData;
  const sliderContent = data?.sliderContent;

  if (!sliderContent) {
    return <ErrorPage />;
  }

  return (
    <Layout>
      <Stack spacing={8} useFlexGap>
        <FeaturedProjectSlider items={sliderContent} />
        <div style={{ position: 'relative' }}>
          <NewsSection updates={[]} />
        </div>
      </Stack>
    </Layout>
  );
}

export default SkeletonIndexPage;
