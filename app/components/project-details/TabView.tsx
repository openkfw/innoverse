'use client';

import { ReactNode, SyntheticEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled, SxProps } from '@mui/material/styles';
import Tab, { TabProps } from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import { Project, ProjectUpdateWithAdditionalData } from '@/common/types';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

import { CollaborationTab } from '../collaboration/CollaborationTab';
import { UpdatesTab } from '../updates/UpdatesTab';

import { EventsTab } from './events/EventsTab';
import { ProjectProgress } from './ProjectProgress';

interface TabPanelProps {
  children?: ReactNode;
  id: string;
  index: number;
  value: number;
}

interface BasicTabsProps {
  project: Project;
  projectName: string;
  isFollowed: boolean;
  setFollowed: (i: boolean) => void;
  followersAmount: number;
  setFollowersAmount: (i: number) => void;
}

export default function TabView(props: BasicTabsProps) {
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState(0);
  const [shouldScrollOnRender, setShouldScrollOnRender] = useState(true);
  const [project, setProject] = useState(props.project);

  const { isFollowed, setFollowed, followersAmount, setFollowersAmount } = props;
  const otherProps = { setFollowed, isFollowed, followersAmount, setFollowersAmount };

  const { opportunities, collaborationQuestions, updates, futureEvents, surveyQuestions } = project;
  const collaborationActivities = opportunities.length + surveyQuestions.length + collaborationQuestions.length;
  useEffect(() => {
    const tabQueryParam = searchParams?.get('tab');
    if (tabQueryParam && activeTab !== Number(tabQueryParam)) {
      setActiveTab(Number(tabQueryParam));
    }

    if (shouldScrollOnRender && tabQueryParam) {
      setShouldScrollOnRender(false);

      let sectionId;
      switch (Number(tabQueryParam)) {
        case 0:
          sectionId = 'project-progress-tab';
          break;
        case 1:
          sectionId = 'collaboration-tab';
          break;
        case 2:
          sectionId = 'updates-tab';
          break;
        case 3:
          sectionId = 'events-tab';
          break;
        default:
          sectionId = 'moredetails';
      }

      const section = document.getElementById(sectionId)?.offsetTop;
      if (section) {
        window.scrollTo({
          top: section,
          behavior: 'smooth',
        });
      }
    }
  }, [activeTab, shouldScrollOnRender, searchParams]);

  function setProjectUpdates(updates: ProjectUpdateWithAdditionalData[]) {
    setProject({ ...project, updates });
  }

  function handleTabChange(_: SyntheticEvent, newValue: number) {
    setActiveTab(newValue);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', newValue.toString());
    window.history.pushState(null, '', `?${params.toString()}`);
  }

  function handleTabClick() {
    setShouldScrollOnRender(true);
  }

  return (
    <Box sx={containerStyles} id="moredetails">
      <CustomTabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="tab switcher"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
      >
        <CustomTab
          id="tab-project-progress"
          aria-controls="project-progress-tab"
          onClick={handleTabClick}
          label={
            <Typography variant="subtitle1" sx={typographyStyles}>
              {m.components_projectdetails_tabView_innoInfos()}
            </Typography>
          }
        />
        <CustomTab
          id="tab-collaboration"
          aria-controls="collaboration-tab"
          onClick={handleTabClick}
          label={
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle1" color="secondary.main" sx={typographyStyles}>
                {collaborationActivities}
              </Typography>
              <Typography variant="subtitle1" sx={typographyStyles}>
                {m.components_projectdetails_tabView_collaboration()}
              </Typography>
            </Stack>
          }
        />
        <CustomTab
          id="tab-updates"
          aria-controls="updates-tab"
          onClick={handleTabClick}
          label={
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle1" color="secondary.main" sx={typographyStyles}>
                {updates.length}
              </Typography>
              <Typography variant="subtitle1" sx={typographyStyles}>
                {m.components_projectdetails_tabView_news()}
              </Typography>
            </Stack>
          }
        />
        <CustomTab
          id="tab-events"
          aria-controls="events-tab"
          onClick={handleTabClick}
          label={
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle1" color="secondary.main" sx={typographyStyles}>
                {futureEvents?.length}
              </Typography>
              <Typography variant="subtitle1" sx={typographyStyles}>
                {m.components_projectdetails_tabView_events()}
              </Typography>
            </Stack>
          }
        />
      </CustomTabs>
      <CustomTabPanel value={activeTab} index={0} id="project-progress-tab">
        <ProjectProgress project={project} projectName={project.title} />
      </CustomTabPanel>
      <CustomTabPanel value={activeTab} index={1} id="collaboration-tab">
        <CollaborationTab project={project} {...otherProps} />
      </CustomTabPanel>
      <CustomTabPanel value={activeTab} index={2} id="updates-tab">
        <UpdatesTab project={project} onUpdate={setProjectUpdates} {...otherProps} />
      </CustomTabPanel>
      <CustomTabPanel value={activeTab} index={3} id="events-tab">
        <EventsTab project={project} {...otherProps} />
      </CustomTabPanel>
    </Box>
  );
}

// Tab View Styles
const containerStyles: SxProps = {
  width: '85%',
  maxWidth: '1280px',
  padding: 0,
  [theme.breakpoints.down('md')]: {
    width: '90%',
  },
};

const customTabsStyles = {
  borderBottom: '1px solid rgba(232, 232, 232, 0.5)',
  marginLeft: '64px',
  marginRight: '20px',
  '& .MuiTabs-indicator': {
    backgroundColor: '#FFF',
  },
  '& .MuiTabs-scrollButtons': {
    color: 'white',
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: '20px',
    marginRight: '20px',
  },
};

const customTabStyles = {
  minWidth: 0,
  fontWeight: theme.typography.fontWeightRegular,
  color: 'rgba(242, 242, 242, 0.85)',
  '&:hover': {
    color: '#FFF',
    opacity: 1,
  },
  '&.Mui-selected': {
    color: '#FFF',
    fontWeight: theme.typography.fontWeightMedium,
  },
  '&:not(:last-child)': {
    marginRight: '46px',
  },
};

const typographyStyles = {
  fontSize: '22px',
};

const CustomTabs = styled(Tabs)(customTabsStyles);
const CustomTab = styled((props: TabProps) => <Tab disableRipple data-testid="tab" {...props} />)(customTabStyles);

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, id, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={id} aria-labelledby={`tab-${id}`} {...other}>
      <Box sx={{ paddingTop: 3 }}>{children}</Box>
    </div>
  );
}
