import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Project } from '@/common/types';
import theme from '@/styles/theme';

import { UnsavedCommentChangesDialog } from '../common/comments/UnsavedChangesDialog';
import EmptyTabContent from '../project-details/EmptyTabContent';

import OpportunityCard from './opportunities/OpportunityCard';
import { SurveyCard } from './survey/SurveyCard';
import { CollaborationQuestionCard } from './CollaborationQuestionCard';

interface CollaborationTabProps {
  project: Project;
  isFollowed: boolean;
  setFollowed: (i: boolean) => void;
  followersAmount: number;
  setFollowersAmount: (i: number) => void;
}

export const CollaborationTab = ({ project, ...otherProps }: CollaborationTabProps) => {
  const collaborationActivities =
    project.opportunities.length + project.surveyQuestions.length + project.collaborationQuestions.length;

  if (collaborationActivities === 0) {
    return (
      <Card sx={containerStyles}>
        <EmptyTabContent
          message="Momentan scheint es hier nichts zu geben. Schaue später nochmal um zu sehen was sich noch ändert! Verpasse es nicht! 😉"
          project={project}
          {...otherProps}
        />
      </Card>
    );
  }

  return (
    <Card sx={containerStyles}>
      <Box sx={colorOverlayStyles} />

      <CardContent style={{ padding: 0 }}>
        <Box sx={cardContentStyles}>
          <OpportunitiesSection project={project} />
          <SurveyQuestionsSection project={project} />
          <CollaborationQuestionsSection project={project} />
        </Box>
      </CardContent>

      <UnsavedCommentChangesDialog />
    </Card>
  );
};

const OpportunitiesSection = ({ project }: { project: Project }) => {
  if (!project.opportunities.length) return <></>;

  return (
    <>
      <Typography color="primary.main" sx={titleStyles} id="opportunities-section">
        Opportunities
      </Typography>

      <Stack sx={gridStyles} spacing={{ xs: 6, md: 10 }}>
        {project.opportunities.map((opportunity, idx) => (
          <OpportunityCard key={idx} opportunity={opportunity} projectName={project.title} />
        ))}
      </Stack>

      <Divider textAlign="left" sx={dividerStyles} />
    </>
  );
};

const SurveyQuestionsSection = ({ project }: { project: Project }) => {
  if (!project.surveyQuestions.length) return <></>;

  return (
    <>
      <Typography color="primary.main" sx={titleStyles} id="surveys-section">
        Umfrage
      </Typography>

      <Stack sx={gridStyles} spacing={20}>
        {project.surveyQuestions.map((surveyQuestion, idx) => (
          <SurveyCard key={idx} surveyQuestion={surveyQuestion} projectId={project.id} />
        ))}
      </Stack>

      <Divider textAlign="left" sx={dividerStyles} />
    </>
  );
};

const CollaborationQuestionsSection = ({ project }: { project: Project }) => {
  if (!project.collaborationQuestions.length) return <></>;

  return (
    <>
      <Typography color="primary.main" sx={titleStyles} id="collaboration-questions-section">
        Hilf uns bei diesen Fragen
      </Typography>
      <Stack sx={gridStyles} spacing={{ xs: 6, md: 12 }}>
        {project.collaborationQuestions.map((question, idx) => (
          <CollaborationQuestionCard
            key={idx}
            projectName={project.title}
            content={question}
            projectId={project.id}
            questionId={question.id}
          />
        ))}
      </Stack>
    </>
  );
};

// Collaboration Tab Styles
const containerStyles = {
  borderRadius: '24px',
  background: '#FFF',
  position: 'relative',
  zIndex: 0,
  boxShadow:
    '0px 8px 15px -7px rgba(0, 0, 0, 0.10), 0px 12px 38px 3px rgba(0, 0, 0, 0.03), 0px 9px 46px 8px rgba(0, 0, 0, 0.35)',
};

const cardContentStyles = {
  padding: '88px 0',
  [theme.breakpoints.down('md')]: {
    padding: '48px 0',
  },
};

const colorOverlayStyles = {
  width: '50%',
  height: '100%',
  borderRadius: 'var(--2, 16px) 0px 0px var(--2, 16px)',
  opacity: 0.6,
  background: 'linear-gradient(90deg, rgba(240, 238, 225, 0.00) 10.42%, #F0EEE1 100%)',
  position: 'absolute',
  zIndex: -1,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
};

const gridStyles = {
  paddingX: '64px',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    paddingX: '24px',
  },
};

const dividerStyles = {
  my: { xs: '48px', md: '88px' },
};

const titleStyles = {
  marginLeft: '64px',
  fontSize: 12,
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '169%',
  letterSpacing: 1,
  textTransform: 'uppercase',
  [theme.breakpoints.down('md')]: {
    marginLeft: '24px',
  },
};
