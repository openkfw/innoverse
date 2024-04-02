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
  paddingTop: 1,
  paddingLeft: 0,
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
  gap: '4px',
  color: 'primary.main',
  background: 'none',
  outline: 'none',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  [theme.breakpoints.down('md')]: {
    alignSelf: 'flex-end',
  },
};
