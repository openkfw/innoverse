'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import BreadcrumbsNav from '@/components/common/BreadcrumbsNav';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/project-details/HeroSection';
import TabView from '@/components/project-details/TabView';

import { ProjectInfoCard } from '../../components/project-details/ProjectInfoCard';

function ProjectPage() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <Layout>
      <Stack spacing={8} useFlexGap>
        <Container maxWidth="lg" sx={{ pt: 10, pb: 5 }}>
          <BreadcrumbsNav />
          <HeroSection />
        </Container>
        <Box sx={{ pb: 5 }} display="flex" justifyContent="center" alignItems="center">
          <ProjectInfoCard setActiveTab={setActiveTab} />
        </Box>
        <Box sx={{ pb: 5 }} display="flex" justifyContent="center" alignItems="center">
          <TabView activeTab={activeTab} setActiveTab={setActiveTab} />
        </Box>
      </Stack>
    </Layout>
  );
}

export default ProjectPage;
