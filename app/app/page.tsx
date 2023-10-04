import Image from 'next/image';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { FeaturedProjectSlider } from '@/components/landing/featuredProjectSection/FeaturedProjectSlider';
import { NewsSection } from '@/components/landing/newsSection/NewsSection';
import { ProjectSection } from '@/components/landing/projectSection/ProjectSection';
import Footer from '@/components/layout/Footer';
import { news } from '@/repository/mock/landing/news-section';
import { GetFeaturedSliderItemsQuery, STRAPI_QUERY, withResponseTransformer } from '@/utils/queries';

import { MappingProjectsCard } from '../components/landing/mappingProjectsSection/MappingProjectsCard';
import Layout from '../components/layout/Layout';

import bgBubble from '/public/images/bg-image.png';

async function getData() {
  // As this is the "Main" Page no ISR here. Fetch data from Endpoint via fetch
  // Revalidate the cache every 2 mins.
  // Use fetch here as we want to revalidate the data from the CMS.
  // As the page is not staticaly genereate and no ISR is used here fetch is required
  try {
    const request = await fetch(process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authentication: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        query: GetFeaturedSliderItemsQuery,
      }),
      next: { revalidate: 60 * 2 },
    });
    const result = withResponseTransformer(STRAPI_QUERY.GetFeaturedSliderItems, await request.json());
    return {
      sliderContent: result?.items,
      news: news,
    };
  } catch (err) {
    console.info(err);
  }
}

async function IndexPage() {
  const data = await getData();
  const sliderContent = data?.sliderContent;
  const news = data?.news;
  if (!sliderContent || !news) {
    return <></>;
  }
  return (
    <Layout>
      <Stack spacing={8} useFlexGap>
        <Box sx={{ pt: 10, marginRight: '5%', marginBottom: '10%', display: 'flex' }}>
          <FeaturedProjectSlider items={sliderContent} />
        </Box>

        <Box sx={{ marginLeft: '5%', overflow: 'hidden' }}>
          <NewsSection news={news} />
        </Box>

        <Box sx={{ marginLeft: '5%', position: 'relative', overflowX: 'hidden' }}>
          {/* Right bubble in the background */}
          <Image
            src={bgBubble}
            alt="background-bubble"
            sizes="33vw"
            style={{
              position: 'absolute',
              width: 570,
              height: 460,
              zIndex: 0,
              opacity: 0.56,
              right: 0,
              mixBlendMode: 'lighten',
              transform: 'translate(50%, -10%)',
            }}
          />
          <ProjectSection />
        </Box>

        <Box sx={{ position: 'relative', overflowX: 'hidden' }}>
          {/* Left bubble in the background */}
          <Image
            src={bgBubble}
            alt="background-bubble"
            sizes="33vw"
            style={{
              position: 'absolute',
              width: 570,
              height: 460,
              zIndex: 0,
              opacity: 0.9,
              left: 0,
              overflowX: 'hidden',
              mixBlendMode: 'lighten',
              transform: 'translate(-50%, 20%)',
            }}
          />
          <MappingProjectsCard />
        </Box>

        <Box sx={{ marginLeft: 146 / 8, marginBottom: 48 / 8 }}>
          <Footer />
        </Box>
      </Stack>
    </Layout>
  );
}

export default IndexPage;
