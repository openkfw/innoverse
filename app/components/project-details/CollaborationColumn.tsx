'use client';

import { ArrowForwardOutlined } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';

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
  offset: number;
  buttonText: string;
  handleCollaborationClick: (offset: number) => void;
  borders?: boolean;
}

const Section = ({ icon, title, subtitle, offset, buttonText, handleCollaborationClick, borders }: SectionProps) => (
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
    <Button sx={forwardButtonStyles} onClick={() => handleCollaborationClick(offset)}>
      <ArrowForwardOutlined sx={{ color: 'secondary.main' }} />
      <Typography variant="subtitle2">{buttonText}</Typography>
    </Button>
  </Grid>
);

const CollaborationColumn = (props: CollaborationProps) => {
  const { project, setActiveTab } = props;
  const { surveyQuestions, opportunities, collaborationQuestions } = project;

  function handleCollaborationClick(offset: number) {
    const scroll = () => {
      const section = document.getElementById('collaboration-tab')?.offsetTop;
      if (section) {
        window.scrollTo({
          top: section - offset,
          behavior: 'smooth',
        });
      }
    };

    setActiveTab(1);
    setTimeout(scroll, 0);
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
            offset={-325}
            buttonText="Zu den Fragen"
            handleCollaborationClick={handleCollaborationClick}
          />
          <Section
            icon={<CurrentPollsIcon />}
            title="Aktuelle Umfragen"
            subtitle={`${surveyQuestions.length} Umfrage(n) offen`}
            offset={75}
            buttonText="Abstimmen"
            handleCollaborationClick={handleCollaborationClick}
            borders={true}
          />
          <Section
            icon={<SupportTheTeamIcon />}
            title="Unterstütze das Team"
            subtitle={`${opportunities.length} Anfragen warten aktuell auf Dich`}
            offset={75}
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
