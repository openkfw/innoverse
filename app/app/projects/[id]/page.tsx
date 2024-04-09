import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import BreadcrumbsNav from '@/components/common/BreadcrumbsNav';
import ErrorPage from '@/components/error/ErrorPage';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/project-details/HeroSection';
import ProjectWrapper from '@/components/project-details/ProjectWrapper';
import { getAllProjectData } from '@/utils/requests';

async function ProjectPage({ params }: { params: { id: string } }) {
  const { project, likes, followers, isLiked, isFollowed, futureEvents, pastEvents } = await getAllProjectData(
    params.id,
  );

  if (!project) {
    return <ErrorPage message="Projekt konnte nicht abgerufen werden, versuchen Sie es später erneut" />;
  }

  return (
    <Layout>
      {project && (
        <Stack spacing={8} useFlexGap>
          <Container maxWidth="lg" sx={containerStyles}>
            <BreadcrumbsNav activePage="Projekt" />
            <HeroSection project={project} />
          </Container>
          <ProjectWrapper
            projectData={{
              ...project,
              likes,
              followers,
              isLiked,
              isFollowed,
              futureEvents,
              pastEvents,
            }}
          />
        </Stack>
      )}
    </Layout>
  );
}

export default ProjectPage;

// Page Styles
const containerStyles = {
  paddingLeft: 0,
  paddingRight: 0,
};
