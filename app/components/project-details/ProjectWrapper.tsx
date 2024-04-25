'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';

import { ProjectContextProvider } from '@/app/contexts/project-context';
import { Project } from '@/common/types';

import { ProjectInfoCard } from './ProjectInfoCard';
import TabView from './TabView';

type ProjectWrapperProps = {
  project: Project;
};

export const ProjectWrapper = ({ project }: ProjectWrapperProps) => {
  const { likes, followers, isLiked, isFollowed } = project;
  const [isProjectLiked, setIsProjectLiked] = useState<boolean>(isLiked);
  const [isProjectFollowed, setIsProjectFollowed] = useState<boolean>(isFollowed);
  const [likesAmount, setLikesAmount] = useState(likes.length);
  const [followersAmount, setFollowersAmount] = useState(followers.length);

  return (
    <ProjectContextProvider project={project}>
      <Box sx={{ pb: 5 }} display="flex" justifyContent="center" alignItems="center">
        <ProjectInfoCard
          project={project}
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
        <TabView project={project} />
      </Box>
    </ProjectContextProvider>
  );
};

export default ProjectWrapper;
