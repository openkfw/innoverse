'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { Project } from '@/common/types';
import { getProjectById } from '@/utils/requests';

interface ProjectContextInterface {
  surveyVotesAmount: number;
  collaborationCommentsAmount: number;
  setSurveyVotesAmount: (i: number) => void;
  setCollaborationCommentsAmount: (i: number) => void;
}

const defaultState: ProjectContextInterface = {
  surveyVotesAmount: 0,
  collaborationCommentsAmount: 0,
  setSurveyVotesAmount: () => {},
  setCollaborationCommentsAmount: () => {},
};

const ProjectContext = createContext(defaultState);

export const ProjectContextProvider = ({ projectId, children }: { projectId: string; children: React.ReactNode }) => {
  const [surveyVotesAmount, setSurveyVotesAmount] = useState<number>(defaultState.surveyVotesAmount);
  const [collaborationCommentsAmount, setCollaborationCommentsAmount] = useState<number>(
    defaultState.collaborationCommentsAmount,
  );

  useEffect(() => {
    const setData = async () => {
      const project = (await getProjectById(projectId)) as Project;
      if (project) {
        const surveyVotes = project.surveyQuestions.reduce((sum, survey) => sum + survey.votes.length, 0);
        const collaborationComments = project.collaborationQuestions.reduce(
          (sum, comment) => sum + comment.comments.length,
          0,
        );
        setSurveyVotesAmount(surveyVotes);
        setCollaborationCommentsAmount(collaborationComments);
      }
    };
    setData();
  }, [projectId]);

  const contextObject: ProjectContextInterface = {
    surveyVotesAmount,
    collaborationCommentsAmount,
    setSurveyVotesAmount,
    setCollaborationCommentsAmount,
  };

  return <ProjectContext.Provider value={contextObject}> {children}</ProjectContext.Provider>;
};

export const useProject = () => useContext(ProjectContext);
