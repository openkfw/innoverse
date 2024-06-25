'use client';

import { ArrowForwardOutlined } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Project } from '@/common/types';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

import CurrentPollsIcon from '../icons/CurrentPollsIcon';
import JoinInIcon from '../icons/JoinInIcon';
import SupportTheTeamIcon from '../icons/SupportTheTeamIcon';

interface CollaborationProps {
  project: Project;
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  sectionId: string;
  buttonText: string;
  handleCollaborationClick: (sectionId: string) => void;
  borders?: boolean;
}

const Section = ({ icon, title, subtitle, sectionId, buttonText, handleCollaborationClick, borders }: SectionProps) => (
  <Grid sx={{ ...rowStyles, ...(borders ? withBorders : {}) }}>
    <Box sx={sectionStyles}>
      <Box>{icon}</Box>
      <Grid sx={textStyles}>
        <Typography variant="body1" color="text.primary" sx={sectionTitleStyles}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.primary" sx={sectionSubtitleStyles}>
          {subtitle}
        </Typography>
      </Grid>
    </Box>
    <Button sx={forwardButtonStyles} onClick={() => handleCollaborationClick(sectionId)}>
      <ArrowForwardOutlined sx={{ color: 'primary.main', fontSize: '18px' }} />
      <Typography variant="button" color="primary.main">
        {buttonText}
      </Typography>
    </Button>
  </Grid>
);

const CollaborationColumn = (props: CollaborationProps) => {
  const { project } = props;
  const { surveyQuestions, opportunities, collaborationQuestions } = project;

  function handleCollaborationClick(sectionId: string) {
    const newUrl = `${window.location.pathname}?tab=1`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        window.scrollTo({
          top: section.getBoundingClientRect().top + window.scrollY - 70,
          behavior: 'smooth',
        });
      }
    }, 100);
  }

  return (
    <>
      <Typography variant="overline" sx={titleStyles}>
        {m.components_projectdetails_collaborationColumn_collaboration()}
      </Typography>
      <Card sx={cardStyles}>
        <CardContent sx={cardContentStyles}>
          <Section
            icon={<JoinInIcon />}
            title={m.components_projectdetails_collaborationColumn_helpTeam()}
            subtitle={`${collaborationQuestions.length} ${m.components_projectdetails_collaborationColumn_questionInput()}`}
            sectionId="collaboration-questions-section"
            buttonText={m.components_projectdetails_collaborationColumn_toQuestions()}
            handleCollaborationClick={handleCollaborationClick}
          />
          <Section
            icon={<CurrentPollsIcon />}
            title={m.components_projectdetails_collaborationColumn_surveys()}
            subtitle={`${surveyQuestions.length} ${m.components_projectdetails_collaborationColumn_openSurveys()}`}
            sectionId="surveys-section"
            buttonText={m.components_projectdetails_collaborationColumn_vote()}
            handleCollaborationClick={handleCollaborationClick}
            borders={true}
          />
          <Section
            icon={<SupportTheTeamIcon />}
            title={m.components_projectdetails_collaborationColumn_supportTeam()}
            subtitle={`${opportunities.length} ${m.components_projectdetails_collaborationColumn_waitingInquiries()}`}
            sectionId="opportunities-section"
            buttonText={m.components_projectdetails_collaborationColumn_participate()}
            handleCollaborationClick={handleCollaborationClick}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default CollaborationColumn;

// Collaboration Column Styles
const titleStyles = {
  textAlign: 'center',
  color: 'primary.light',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
};

const sectionTitleStyles = {
  fontWeight: '700',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  fontFamily: 'PFCentroSansProReg',
  color: 'text.primary',
};

const sectionSubtitleStyles = {
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
};

const cardStyles = {
  background: 'inherit',
  borderRadius: '8px',
  margin: 0,
  mt: 2,
  padding: 0,
  minHeight: '250px',
  border: 'none',
  boxShadow: 'none',
  overflow: 'visible',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: '411px',
    overflow: 'unset',
  },
};

const cardContentStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  minHeight: '250px',
  paddingTop: 1,
  paddingLeft: 0,
  paddingRight: 0,
  [theme.breakpoints.down('md')]: {
    paddingLeft: 1,
    marginTop: 3,
  },
};

const rowStyles = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  py: '15px',
  px: 0,
  marginRight: 0,
  flex: 1,
  ':first-child': {
    pt: 0,
  },
  ':last-child': {
    pb: 0,
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'unset',
  },
};

const sectionStyles = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  flex: 1,
};

const withBorders = {
  borderTop: '1px solid #DFE5E2',
  borderBottom: '1px solid #DFE5E2',
};

const textStyles = {
  marginLeft: '16px',
  flex: 1,
};

const forwardButtonStyles: SxProps = {
  display: 'flex',
  alignSelf: 'flex-start',
  height: 'fit-content',
  width: 'fit-content',
  padding: '8px 16px',
  margin: 0,
  marginRight: -2,
  gap: '4px',
  color: 'primary.main',
  background: 'none',
  outline: 'none',
  zIndex: 1,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  [theme.breakpoints.down('md')]: {
    alignSelf: 'flex-end',
    marginRight: 'unset',
  },
};
