'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { Project } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import { getProjectById } from '@/utils/requests';

interface ProjectContextInterface {
  surveyVotesAmount: number;
  isLoadingSurveyVotesAmount: boolean;
  collaborationCommentsAmount: number;
  setSurveyVotesAmount: (setter: number | ((prev: number) => number)) => void;
  setCollaborationCommentsAmount: (i: number) => void;
}

const defaultState: ProjectContextInterface = {
  surveyVotesAmount: 0,
  isLoadingSurveyVotesAmount: true,
  collaborationCommentsAmount: 0,
  setSurveyVotesAmount: (i) => i,
  setCollaborationCommentsAmount: () => {},
};

const ProjectContext = createContext(defaultState);

export const ProjectContextProvider = ({ projectId, children }: { projectId: string; children: React.ReactNode }) => {
  const [isLoadingSurveyVotesAmount, setIsLoadingSurveyVotesAmount] = useState(true);
  const [surveyVotesAmount, setSurveyVotesAmount] = useState<number>(defaultState.surveyVotesAmount);
  const [collaborationCommentsAmount, setCollaborationCommentsAmount] = useState<number>(
    defaultState.collaborationCommentsAmount,
  );
  const appInsights = useAppInsightsContext();

  useEffect(() => {
    const setData = async () => {
      try {
        const project = (await getProjectById(projectId)) as Project;

        if (!project) return;

        const surveyVotes = project.surveyQuestions.reduce((sum, survey) => sum + survey.votes.length, 0);
        const collaborationComments = project.collaborationQuestions.reduce(
          (sum, comment) => sum + comment.comments.length,
          0,
        );

        setSurveyVotesAmount(surveyVotes);
        setCollaborationCommentsAmount(collaborationComments);
        setIsLoadingSurveyVotesAmount(false);
      } catch (error) {
        errorMessage({ message: 'Failed to load project details. Please try again.' });
        console.error('Error fetching project details:', error);
        appInsights.trackException({
          exception: new Error('Error fetching project details', { cause: error }),
          severityLevel: SeverityLevel.Error,
        });
      }
    };
    setData();
  }, [projectId]);

  const contextObject: ProjectContextInterface = {
    surveyVotesAmount,
    isLoadingSurveyVotesAmount,
    collaborationCommentsAmount,
    setSurveyVotesAmount,
    setCollaborationCommentsAmount,
  };

  return <ProjectContext.Provider value={contextObject}> {children}</ProjectContext.Provider>;
};

export const useProject = () => useContext(ProjectContext);
