'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { MainPageData, Project, ProjectsQueryResult } from '@/common/types';
import { FeaturedProjectSlider } from '@/components/landing/featuredProjectSection/FeaturedProjectSlider';
import FeedbackSection from '@/components/landing/feedbackSection/FeedbackSection';
import { BackgroundArrows } from '@/components/landing/newsSection/BackgroundArrows';
import { NewsSection } from '@/components/landing/newsSection/NewsSection';
import { ProjectSection } from '@/components/landing/projectSection/ProjectSection';
import theme from '@/styles/theme';
import { GetProjectsQuery, STRAPI_QUERY, withResponseTransformer } from '@/utils/queries';

import { MappingProjectsCard } from '../components/landing/mappingProjectsSection/MappingProjectsCard';
import Layout from '../components/layout/Layout';

import bgBubble from '/public/images/bg-image.png';

async function getData() {
  // As this is the "Main" Page no ISR here. Fetch data from Endpoint via fetch
  // Revalidate the cache every 2 mins.
  // Use fetch here as we want to revalidate the data from the CMS.
  // As the page is not staticaly generated and no ISR is used here fetch is required
  try {
    const requestProjects = await fetch('/api/strapi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        query: GetProjectsQuery,
      }),
      next: { revalidate: 60 * 2 },
    });

    const result = withResponseTransformer(
      STRAPI_QUERY.GetProjects,
      await requestProjects.json(),
    ) as ProjectsQueryResult;

    // Filter projects which are featured in the main slider
    const featuredProjects = result.projects.filter((project: Project) => project.featured == true) as Project[];

    return {
      sliderContent: featuredProjects,
      projects: result.projects,
      updates: result.updates,
    };
  } catch (err) {
    console.info(err);
  }
}

function IndexPage() {
  const [data, setData] = useState<MainPageData>();

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

        <Box sx={feedbackSectionStyles}>
          <FeedbackSection />
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

// todo - awaiting design for sm screens
const feedbackSectionStyles = {
  width: '100%',
  marginTop: '-100px',
  paddingRight: '32px',
  display: 'flex',
  justifyContent: 'flex-end',
};
