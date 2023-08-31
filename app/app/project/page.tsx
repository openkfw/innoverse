'use client';

import Container from '@mui/material/Container';

import BreadcrumbsNav from '@/components/common/BreadcrumbsNav';
import Layout from '@/components/layout/Layout';
import { HeroSection } from '@/components/projects/HeroSection';

function ProjectPage() {
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <BreadcrumbsNav />
        <HeroSection />
      </Container>
    </Layout>
  );
}

export default ProjectPage;
