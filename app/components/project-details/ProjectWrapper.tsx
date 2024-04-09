'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';

import { ProjectContextProvider } from '@/app/contexts/project-context';
import { ProjectData } from '@/common/types';

import { ProjectInfoCard } from './ProjectInfoCard';
import TabView from './TabView';

type ProjectWrapperProps = {
  projectData: ProjectData;
};

export const ProjectWrapper = ({ projectData }: ProjectWrapperProps) => {
  const { likes, followers, isLiked, isFollowed } = projectData;
  const [isProjectLiked, setIsProjectLiked] = useState<boolean>(isLiked);
  const [isProjectFollowed, setIsProjectFollowed] = useState<boolean>(isFollowed);
  const [likesAmount, setLikesAmount] = useState(likes.length);
  const [followersAmount, setFollowersAmount] = useState(followers.length);

  return (
    <ProjectContextProvider projectData={projectData}>
      <Box sx={{ pb: 5 }} display="flex" justifyContent="center" alignItems="center">
        <ProjectInfoCard
          project={projectData}
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
        <TabView projectData={projectData} projectName={projectData.title} />
      </Box>
    </ProjectContextProvider>
  );
};

export default ProjectWrapper;
