import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { Project } from '@/common/types';

import InteractionButton, { InteractionType } from '../common/InteractionButton';

import { SurveyCard } from './survey/SurveyCard';
import { CollaborationQuestionCard } from './CollaborationQuestionCard';

interface CollaborationTabProps {
  project: Project;
}

export const CollaborationTab = (props: CollaborationTabProps) => {
  const { project } = props;
  const [surveyQuestions] = useState(project.surveyQuestions);

  return (
    <Card sx={containerStyles}>
      <Box sx={colorOverlayStyles} />

      <CardContent sx={cardContentStyles}>
        <Typography color="primary.main" sx={titleStyles}>
          Opportunities
        </Typography>

        {project.opportunities.map((o, key) => (
          <Grid container spacing={8} sx={gridStyles} key={key}>
            <Grid item xs={6} sx={{ paddingRight: '100px' }}>
              <Typography variant="h5" color="secondary.contrastText">
                {o.title}
              </Typography>
              <Typography variant="body1" color="secondary.contrastText">
                {o.description}
              </Typography>
              <Typography variant="overline" color="primary.main">
                Aufwand: {o.expense}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Box sx={joinTeamStyles}>
                <InteractionButton projectName={project.projectName} interactionType={InteractionType.APPLY} />
                <InteractionButton projectName={project.projectName} interactionType={InteractionType.RECOMMEND} />
              </Box>
            </Grid>
          </Grid>
        ))}

        <Divider textAlign="left" sx={dividerStyles} />

        <Typography color="primary.main" sx={titleStyles}>
          Umfrage
        </Typography>
        <Grid container sx={gridStyles} spacing={8}>
          {surveyQuestions.map((surveyQuestion, i) => (
            <Grid item key={i}>
              <SurveyCard surveyQuestion={surveyQuestion} projectId={project.id} />
            </Grid>
          ))}
        </Grid>

        {project.collaborationQuestions.length > 0 && (
          <>
            <Divider textAlign="left" sx={dividerStyles} />
            <Typography color="primary.main" sx={titleStyles}>
              Hilf uns bei deisen Fragen
            </Typography>
            <Grid container sx={gridStyles} spacing={8}>
              {project.collaborationQuestions.map((question, i) => (
                <Grid item key={i}>
                  <CollaborationQuestionCard
                    projectName={project.projectName}
                    content={question}
                    projectId={project.id}
                    questionId={question.id}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
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
  margin: 0,
  padding: 0,
};

const colorOverlayStyles = {
  width: '50%',
  height: '100%',
  borderRadius: 'var(--2, 16px) 0px 0px var(--2, 16px)',
  opacity: 0.6,
  background: 'linear-gradient(90deg, rgba(240, 238, 225, 0.00) 10.42%, #F0EEE1 100%)',
  position: 'absolute',
  zIndex: -1,
};

const joinTeamStyles = {
  marginLeft: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: 1,
};

const gridStyles = {
  padding: '0 64px 88px 64px',
};

const dividerStyles = {
  // margin: 4,
};

const titleStyles = {
  marginLeft: '64px',
  marginTop: '88px',
  marginBottom: '36px',
  fontSize: 12,
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '169%',
  letterSpacing: 1,
  textTransform: 'uppercase',
};
