'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';

import { Project } from '@/common/types';

import { ProjectInfoCard } from './ProjectInfoCard';
import TabView from './TabView';

type ProjectWrapperProps = {
  project: Project;
};

export const ProjectWrapper = (props: ProjectWrapperProps) => {
  const { project } = props;
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Box sx={{ pb: 5 }} display="flex" justifyContent="center" alignItems="center">
        <ProjectInfoCard project={project} setActiveTab={setActiveTab} />
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <TabView project={project} activeTab={activeTab} setActiveTab={setActiveTab} projectName={project.title} />
      </Box>
    </>
  );
};

export default ProjectWrapper;
