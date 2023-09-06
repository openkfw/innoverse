'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import BreadcrumbsNav from '@/components/common/BreadcrumbsNav';
import Layout from '@/components/layout/Layout';
import TabView from '@/components/project-details/TabView';
import { HeroSection } from '@/components/projects/HeroSection';
import { project_progression } from '@/repository/mock/project/project-page';

import { ProjectInfoCard } from '../../../components/project-details/ProjectInfoCard';

function ProjectPage({ params }: { params: { id: string } }) {
    const [projectInformation] = useState<any>(project_progression[parseInt(params.id) || 0]);
    return (
        <Layout>
            <Stack spacing={8} useFlexGap>
                <Container maxWidth="lg" sx={{ pt: 10, pb: 5 }}>
                    <BreadcrumbsNav />
                    <HeroSection title={projectInformation.hero.title} avatar={projectInformation.hero.avatar} author={projectInformation.hero.author.name} role={projectInformation.hero.author.role} status={projectInformation.hero.project_status} />
                </Container>
                <Box sx={{ pb: 5 }} display="flex" justifyContent="center" alignItems="center">
                    <ProjectInfoCard />
                </Box>
                <Box sx={{ pb: 5 }} display="flex" justifyContent="center" alignItems="center">
                    <TabView />
                </Box>
            </Stack>
        </Layout>
    );
}

export default ProjectPage;
