'use client';

import React, { createContext, useContext, useState } from 'react';

import { Project, SurveyQuestion } from '@/common/types';

interface ProjectContextInterface {
  surveyQuestions: SurveyQuestion[];
  collaborationCommentsAmount: number;
  setCollaborationCommentsAmount: (i: number) => void;
}

const defaultState: ProjectContextInterface = {
  surveyQuestions: [],
  collaborationCommentsAmount: 0,
  setCollaborationCommentsAmount: () => {},
};

const ProjectContext = createContext(defaultState);

export const ProjectContextProvider = ({ project, children }: { project: Project; children: React.ReactNode }) => {
  const [collaborationCommentsAmount, setCollaborationCommentsAmount] = useState<number>(
    project.collaborationQuestions.reduce((sum, comment) => sum + comment.comments.length, 0),
  );

  const contextObject: ProjectContextInterface = {
    surveyQuestions: project.surveyQuestions,
    collaborationCommentsAmount,
    setCollaborationCommentsAmount,
  };

  return <ProjectContext.Provider value={contextObject}> {children}</ProjectContext.Provider>;
};

export const useProject = () => useContext(ProjectContext);
