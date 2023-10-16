'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { FeaturedProjectSlider } from '@/components/landing/featuredProjectSection/FeaturedProjectSlider';
import { BackgroundArrows } from '@/components/landing/newsSection/BackgroundArrows';
import { NewsSection } from '@/components/landing/newsSection/NewsSection';
import { ProjectSection } from '@/components/landing/projectSection/ProjectSection';
import theme from '@/styles/theme';
import {
  GetProjectsSummaryQuery,
  StaticBuildGetFeaturedSliderItemsQuery,
  STRAPI_QUERY,
  withResponseTransformer,
} from '@/utils/queries';

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
        // Authentication: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        query: StaticBuildGetFeaturedSliderItemsQuery,
      }),
      next: { revalidate: 60 * 2 },
    });
    //TODO: ONE QUERY should fetch all the main page data
    const result = withResponseTransformer(STRAPI_QUERY.StaticBuildGetFeaturedSliderItemsQuery, await request.json());

    const requestProjects = await fetch(process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authentication: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        query: GetProjectsSummaryQuery,
      }),
      next: { revalidate: 60 * 2 },
    });
    //TODO: ONE QUERY should fetch all the main page data
    const resultProjects = withResponseTransformer(STRAPI_QUERY.GetProjectsSummaryQuery, await requestProjects.json());

    return {
      sliderContent: result?.items,
      projects: resultProjects?.projects,
      updates: resultProjects?.updates,
    };
  } catch (err) {
    console.info(err);
  }
}

function IndexPage() {
  const [data, setData] = useState<any>();

  useEffect(() => {
    const getProject = async () => {
      const data = await getData();
      if (data) {
        setData(data);
      }
    };

    getProject();
  }, []);

  const sliderContent = data?.sliderContent;
  const projects = data?.projects;
  const updates = data?.updates;

  if (!sliderContent || !projects || !updates) {
    return <></>;
  }
  return (
    <Layout>
      <Stack spacing={8} useFlexGap>
        <Box sx={featuredProjectSliderStyles}>
          <FeaturedProjectSlider items={sliderContent} />
        </Box>

        <div style={{ position: 'relative' }}>
          <Box sx={newsSectionStyles}>
            <NewsSection updates={updates} />
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
          <ProjectSection projects={projects} />
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
          <MappingProjectsCard projects={projects} />
        </Box>
      </Stack>
    </Layout>
  );
}

export default IndexPage;

// Page Styles
const featuredProjectSliderStyles = {
  display: 'flex',
  paddingTop: 10,
  marginRight: '5%',
  marginBottom: '10%',
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
