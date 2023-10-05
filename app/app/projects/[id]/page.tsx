'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import BreadcrumbsNav from '@/components/common/BreadcrumbsNav';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/project-details/HeroSection';
import TabView from '@/components/project-details/TabView';
import { project_updates, projects_progression } from '@/repository/mock/project/project-page';

import { getStandaloneApolloClient } from '@/utils/apolloStandalone';
import { STRAPI_QUERY, StaticBuildGetProjectIdsQuery, withResponseTransformer } from '@/utils/queries';
import { ProjectInfoCard } from '../../../components/project-details/ProjectInfoCard';

function ProjectPage({ params }: { params: { id: string } }) {
  const projectId = parseInt(params.id) || 1;
  let projectInformation = projects_progression.projects.filter((project) => project.projectId == projectId)[0];
  const projectUpdates = project_updates.filter((project) => project.projectId == projectId)[0];

  const [activeTab, setActiveTab] = useState(0);

  // TODO: Remove when there is data for all the projects
  const updates = projectUpdates ? projectUpdates.updates : project_updates[0].updates;
  if (!projectInformation) {
    projectInformation = projects_progression.projects[0];
  }

  return (
    <Layout>
      <Stack spacing={8} useFlexGap>
        <Container maxWidth="lg" sx={{ pb: 5 }}>
          <BreadcrumbsNav />
          <HeroSection
            title={projectInformation.hero.title}
            avatar={projectInformation.hero.author.avatar}
            author={projectInformation.hero.author.name}
            role={projectInformation.hero.author.role}
            status={projectInformation.hero.projectStatus}
          />
        </Container>
        <Box sx={{ pb: 5 }} display="flex" justifyContent="center" alignItems="center">
          <ProjectInfoCard projectSummary={projectInformation.projectSummary} setActiveTab={setActiveTab} />
        </Box>
        <Box sx={{ pb: 5 }} display="flex" justifyContent="center" alignItems="center">
          <TabView
            projectStatus={projectInformation.projectStatus}
            updates={updates}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </Box>
      </Stack>
    </Layout>
  );
}

export default ProjectPage;

export async function getStaticPaths() {
  const client = await getStandaloneApolloClient();
  const { data, error } = await client.query(StaticBuildGetProjectIdsQuery)
  if (error)
    throw new Error(JSON.stringify(error))

  const pageIds = withResponseTransformer(
    STRAPI_QUERY.StaticBuildFetchProjectIds,
    data
  )

  // Get the paths we want to pre-render based on posts
  const paths = pageIds.map((page) => ({
    params: { id: page.id },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }
}
