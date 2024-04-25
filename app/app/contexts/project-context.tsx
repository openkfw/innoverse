'use client';

import React, { createContext, useContext, useState } from 'react';

import { Project } from '@/common/types';

interface ProjectContextInterface {
  surveyVotesAmount: number;
  collaborationCommentsAmount: number;
  setSurveyVotesAmount: (setter: number | ((prev: number) => number)) => void;
  setCollaborationCommentsAmount: (i: number) => void;
}

const defaultState: ProjectContextInterface = {
  surveyVotesAmount: 0,
  collaborationCommentsAmount: 0,
  setSurveyVotesAmount: (i) => i,
  setCollaborationCommentsAmount: () => {},
};

const ProjectContext = createContext(defaultState);

export const ProjectContextProvider = ({ project, children }: { project: Project; children: React.ReactNode }) => {
  const [surveyVotesAmount, setSurveyVotesAmount] = useState<number>(
    project.surveyQuestions.reduce((sum, survey) => sum + survey.votes.length, 0),
  );
  const [collaborationCommentsAmount, setCollaborationCommentsAmount] = useState<number>(
    project.collaborationQuestions.reduce((sum, comment) => sum + comment.comments.length, 0),
  );

  const contextObject: ProjectContextInterface = {
    surveyVotesAmount,
    collaborationCommentsAmount,
    setSurveyVotesAmount,
    setCollaborationCommentsAmount,
  };

  return <ProjectContext.Provider value={contextObject}> {children}</ProjectContext.Provider>;
};

export const useProject = () => useContext(ProjectContext);
