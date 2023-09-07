'use client';

import Image from 'next/image';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { FeaturedProjectSlider } from '@/components/landing/featuredProjectSection/FeaturedProjectSlider';
import { NewsSection } from '@/components/landing/newsSection/NewsSection';
import { ProjectSection } from '@/components/landing/projectSection/ProjectSection';

import { MappingProjectsCard } from '../components/landing/mappingProjectsSection/MappingProjectsCard';
import Layout from '../components/layout/Layout';

import bgBubble from '/public/images/bg-image.png';

function IndexPage() {
  return (
    <Layout>
      <Stack spacing={8} useFlexGap>
        <Box
          sx={{
            pt: 10,
            marginRight: '5%',
            display: 'flex',
          }}
        >
          <FeaturedProjectSlider />
        </Box>

        <Box
          sx={{
            marginLeft: '5%',
            overflow: 'hidden',
          }}
        >
          <NewsSection />
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
      </Stack>
    </Layout>
  );
}

export default IndexPage;
