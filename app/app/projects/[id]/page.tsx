'use client';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import { Project, ProjectByIdQueryResult } from '@/common/types';
import BreadcrumbsNav from '@/components/common/BreadcrumbsNav';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/project-details/HeroSection';
import TabView from '@/components/project-details/TabView';
import { GetProjectByIdQuery, STRAPI_QUERY, withResponseTransformer } from '@/utils/queries';

import { ProjectInfoCard } from '../../../components/project-details/ProjectInfoCard';

async function getData(id: string) {
  try {
    const requestProjects = await fetch(process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authentication: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        query: GetProjectByIdQuery,
        variables: { id },
      }),
      next: { revalidate: 60 * 2 },
    });
    const resultProjects = withResponseTransformer(
      STRAPI_QUERY.GetProjectById,
      await requestProjects.json(),
    ) as ProjectByIdQueryResult;

    return {
      project: resultProjects.project,
    };
  } catch (err) {
    console.info(err);
  }
}

function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project>();

  useEffect(() => {
    const getProject = async () => {
      const data = await getData(params.id);
      if (data) {
        setProject(data.project);
      }
    };

    getProject();
  }, []);

  const [activeTab, setActiveTab] = useState(0);

  return (
    <Layout>
      {project && (
        <Stack spacing={8} useFlexGap>
          <Container maxWidth="lg" sx={{ pb: 5 }}>
            <BreadcrumbsNav />
            <HeroSection
              title={project.description.title}
              avatar={project.author.avatar}
              author={project.author.name}
              role={project.author.role}
              status={project.status}
            />
          </Container>
          <Box sx={{ pb: 5 }} display="flex" justifyContent="center" alignItems="center">
            <ProjectInfoCard project={project} setActiveTab={setActiveTab} />
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <TabView
              project={project}
              updates={project.updates}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              projectName={project.title}
            />
          </Box>
        </Stack>
      )}
    </Layout>
  );
}

export default ProjectPage;
