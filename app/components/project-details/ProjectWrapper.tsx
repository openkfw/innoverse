'use client';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';

import { ProjectContextProvider } from '@/app/contexts/project-context';
import { Project } from '@/common/types';
import { isFollowed, isLiked } from '@/components/project-details/likes-follows/actions';

import { ProjectInfoCard } from './ProjectInfoCard';
import TabView from './TabView';

type ProjectWrapperProps = {
  project: Project;
};

export const ProjectWrapper = (props: ProjectWrapperProps) => {
  const { project } = props;
  const [activeTab, setActiveTab] = useState(0);
  const [isProjectLiked, setIsProjectLiked] = useState<boolean>(false);
  const [isProjectFollowed, setIsProjectFollowed] = useState<boolean>(false);
  const [likesAmount, setLikesAmount] = useState(project.likes.length);
  const [followersAmount, setFollowersAmount] = useState(project.followers.length);

  useEffect(() => {
    const setProjectInteraction = async () => {
      setIsProjectLiked((await isLiked({ projectId: project.id })).data);
      setIsProjectFollowed((await isFollowed({ projectId: project.id })).data);
    };
    setProjectInteraction();
  }, [project.id]);

  return (
    <ProjectContextProvider projectId={project.id}>
      <Box sx={{ pb: 5 }} display="flex" justifyContent="center" alignItems="center">
        <ProjectInfoCard
          project={project}
          setActiveTab={setActiveTab}
          isLiked={isProjectLiked}
          isFollowed={isProjectFollowed}
          setLiked={setIsProjectLiked}
          setFollowed={setIsProjectFollowed}
          likesAmount={likesAmount}
          followersAmount={followersAmount}
          setLikesAmount={setLikesAmount}
          setFollowersAmount={setFollowersAmount}
        />
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <TabView project={project} activeTab={activeTab} setActiveTab={setActiveTab} projectName={project.title} />
      </Box>
    </ProjectContextProvider>
  );
};

export default ProjectWrapper;