import Stack from '@mui/material/Stack';

import ErrorPage from '@/components/error/ErrorPage';
import { EventSection } from '@/components/landing/eventsSection/EventsSection';
import FeaturedProjectSlider from '@/components/landing/featuredProjectSection/FeaturedProjectSlider';
import { NewsSection } from '@/components/landing/newsSection/NewsSection';
import Layout from '@/components/layout/Layout';
import { getMainPageData } from '@/utils/requests';

async function SkeletonIndexPage() {
  const data = await getMainPageData();
  const sliderContent = data?.sliderContent;

  if (!sliderContent) {
    return <ErrorPage />;
  }

  return (
    <Layout>
      <Stack spacing={8} useFlexGap>
        <FeaturedProjectSlider items={sliderContent} />
        <div style={{ position: 'relative' }}>
          <EventSection events={[]} />
          <NewsSection updates={[]} />
        </div>
      </Stack>
    </Layout>
  );
}

export default SkeletonIndexPage;
