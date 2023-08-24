'use client';

import Box from '@mui/material/Box';

import { FeaturedProjectSlider } from '@/components/landing/FeaturedProjectSlider';
import { NewsSection } from '@/components/landing/newsSection/NewsSection';
import { ProjectSection } from '@/components/landing/projectSection/ProjectSection';

import Layout from '../components/layout/Layout';

function IndexPage() {
  return (
    <Layout>
      <Box
        sx={{
          marginRight: '10%',
          py: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FeaturedProjectSlider />
      </Box>
      <Box
        sx={{
          marginLeft: '8%',
          overflow: 'hidden',
        }}
      >
        <ProjectSection />
        <Box>
          <NewsSection />
        </Box>
      </Box>
    </Layout>
  );
}

export default IndexPage;
