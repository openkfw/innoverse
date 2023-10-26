'use client';

import Image from 'next/image';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { FeaturedProjectSlider } from '@/components/landing/featuredProjectSection/FeaturedProjectSlider';
import { BackgroundArrows } from '@/components/landing/newsSection/BackgroundArrows';
import { NewsSection } from '@/components/landing/newsSection/NewsSection';
import { ProjectSection } from '@/components/landing/projectSection/ProjectSection';
import theme from '@/styles/theme';

import { MappingProjectsCard } from '../components/landing/mappingProjectsSection/MappingProjectsCard';
import Layout from '../components/layout/Layout';

import bgBubble from '/public/images/bg-image.png';

function IndexPage() {
  return (
    <Layout>
      <Stack spacing={8} useFlexGap>
        <Box sx={featuredProjectSliderStyles}>
          <FeaturedProjectSlider />
        </Box>

        <div style={{ position: 'relative' }}>
          <Box sx={newsSectionStyles}>
            <NewsSection />
          </Box>

          <Box sx={arrowContainerStyles}>
            <BackgroundArrows />
          </Box>
        </div>

        <Box sx={projectSectionStyles}>
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

        <Box sx={mappingProjectsCardStyles}>
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

// Page Styles
const featuredProjectSliderStyles = {
  paddingTop: 10,
  marginRight: '5%',
  marginBottom: 'min(10%, 229px)',
  [theme.breakpoints.down('sm')]: {
    marginRight: 0,
    marginLeft: 0,
  },
};

const newsSectionStyles = {
  overflow: 'hidden',
  [theme.breakpoints.up('sm')]: {
    paddingLeft: '5%',
  },
};

const arrowContainerStyles = {
  position: 'absolute',
  top: '320px',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
  marginLeft: '-130px',
};

const projectSectionStyles = {
  position: 'relative',
  overflowX: 'hidden',
  [theme.breakpoints.up('sm')]: {
    paddingLeft: '5%',
  },
};

const mappingProjectsCardStyles = {
  position: 'relative',
  overflowX: 'hidden',
};
