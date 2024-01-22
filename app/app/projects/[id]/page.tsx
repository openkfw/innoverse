import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import { Follower, Like, Project } from '@/common/types';
import BreadcrumbsNav from '@/components/common/BreadcrumbsNav';
import ErrorPage from '@/components/error/ErrorPage';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/project-details/HeroSection';
import { getAllProjectFollowers, getAllProjectLikes } from '@/components/project-details/likes-follows/actions';
import ProjectWrapper from '@/components/project-details/ProjectWrapper';
import { getProjectById } from '@/utils/requests';

async function ProjectPage({ params }: { params: { id: string } }) {
  const project = (await getProjectById(params.id)) as Project;

  if (!project) {
    return <ErrorPage />;
  }

  const likes = (await getAllProjectLikes({ projectId: project.id })).data as Like[];
  const followers = (await getAllProjectFollowers({ projectId: project.id })).data as Follower[];

  return (
    <Layout>
      {project && (
        <Stack spacing={8} useFlexGap>
          <Container maxWidth="lg" sx={{ pb: 5 }}>
            <BreadcrumbsNav />
            <HeroSection project={project} />
          </Container>
          <ProjectWrapper project={{ ...project, likes, followers }} />
        </Stack>
      )}
    </Layout>
  );
}

export default ProjectPage;
