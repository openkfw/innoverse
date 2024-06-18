import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import BreadcrumbsNav from '@/components/common/BreadcrumbsNav';
import ErrorPage from '@/components/error/ErrorPage';
import HeroSection from '@/components/project-details/HeroSection';
import ProjectWrapper from '@/components/project-details/ProjectWrapper';
import { getProjectById } from '@/utils/requests/project/requests';

export const dynamic = 'force-dynamic';

async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id);

  if (!project) {
    return <ErrorPage message="Projekt konnte nicht abgerufen werden, versuchen Sie es später erneut" />;
  }

  return (
    <>
      {project && (
        <Stack spacing={8} useFlexGap>
          <Container maxWidth="lg" sx={containerStyles}>
            <BreadcrumbsNav activePage="Projekt" />
            <HeroSection project={project} />
          </Container>
          <ProjectWrapper project={project} />
        </Stack>
      )}
    </>
  );
}

export default ProjectPage;

// Page Styles
const containerStyles = {
  paddingLeft: 0,
  paddingRight: 0,
};
