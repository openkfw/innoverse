'use client';

import { ArrowForwardOutlined } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { Project } from '@/common/types';
import theme from '@/styles/theme';

import CurrentPollsIcon from '../icons/CurrentPollsIcon';
import JoinInIcon from '../icons/JoinInIcon';
import SupportTheTeamIcon from '../icons/SupportTheTeamIcon';

interface CollaborationProps {
  project: Project;
  setActiveTab: (tab: number) => void;
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
      {icon}
      <Grid sx={textStyles}>
        <Typography variant="h6" color="text.primary">
          {title}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {subtitle}
        </Typography>
      </Grid>
    </Box>
    <Button sx={forwardButtonStyles} onClick={() => handleCollaborationClick(sectionId)}>
      <ArrowForwardOutlined sx={{ color: 'primary.main' }} />
      <Typography variant="subtitle2" color="primary.main">
        {buttonText}
      </Typography>
    </Button>
  </Grid>
);

const CollaborationColumn = (props: CollaborationProps) => {
  const { project, setActiveTab } = props;
  const { surveyQuestions, opportunities, collaborationQuestions } = project;

  function handleCollaborationClick(sectionId: string) {
    setActiveTab(1);

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
        Zusammenarbeit
      </Typography>
      <Card sx={cardStyles}>
        <CardContent sx={cardContentStyles}>
          <Section
            icon={<JoinInIcon />}
            title="Hilf dem Team mit Deinem Wissen"
            subtitle={`${collaborationQuestions.length} Frage(n) brauchen Deinen Input`}
            sectionId="collaboration-questions-section"
            buttonText="Zu den Fragen"
            handleCollaborationClick={handleCollaborationClick}
          />
          <Section
            icon={<CurrentPollsIcon />}
            title="Aktuelle Umfragen"
            subtitle={`${surveyQuestions.length} Umfrage(n) offen`}
            sectionId="surveys-section"
            buttonText="Abstimmen"
            handleCollaborationClick={handleCollaborationClick}
            borders={true}
          />
          <Section
            icon={<SupportTheTeamIcon />}
            title="Unterstütze das Team"
            subtitle={`${opportunities.length} Anfragen warten aktuell auf Dich`}
            sectionId="opportunities-section"
            buttonText="Teilnehmen"
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

const cardStyles = {
  background: 'inherit',
  borderRadius: '8px',
  margin: 0,
  padding: 0,
  minHeight: '250px',
  border: 'none',
  boxShadow: 'none',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: '411px',
  },
};

const cardContentStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  minHeight: '250px',
};

const rowStyles = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  flex: 1,

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'unset',
    padding: '8px 0',
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

const forwardButtonStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItemd: 'center',
  gap: '4px',
  padding: '8px 16px',
  height: 'fit-content',

  margin: 0,
  background: 'none',
  outline: 'none',
  width: 'fit-content',
  color: 'primary.main',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },

  [theme.breakpoints.down('md')]: {
    alignSelf: 'flex-end',
  },
};
