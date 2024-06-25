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
import { EditingContextProvider } from '../common/editing/editing-context';
import { UpdatesTab } from '../updates/UpdatesTab';

import { EventsTab } from './events/EventsTab';
import { ProjectProgress } from './ProjectProgress';
interface TabPanelProps {
  children?: ReactNode;
  id: string;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, id, index, ...other } = props;

  return (
    <EditingContextProvider>
      <div role="tabpanel" hidden={value !== index} id={id} aria-labelledby={`tab-${id}`} {...other}>
        <Box sx={{ paddingTop: 3 }}>{children}</Box>
      </div>
    </EditingContextProvider>
  );
}

const CustomTabs = styled(Tabs)({
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
});

const CustomTab = styled((props: TabProps) => <Tab disableRipple data-testid="tab" {...props} />)(({ theme }) => ({
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
}));

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
  const [initialRender, setInitialRender] = useState(true);
  const [project, setProject] = useState(props.project);

  const { isFollowed, setFollowed, followersAmount, setFollowersAmount } = props;
  const otherProps = { setFollowed, isFollowed, followersAmount, setFollowersAmount };

  const { opportunities, collaborationQuestions, updates, futureEvents, surveyQuestions } = project;
  const collaborationActivities = opportunities.length + surveyQuestions.length + collaborationQuestions.length;

  const setProjectUpdates = (updates: ProjectUpdateWithAdditionalData[]) => {
    setProject({ ...project, updates });
  };

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);

    const params = new URLSearchParams(window.location.search);
    params.set('tab', newValue.toString());
    window.history.pushState(null, '', `?${params.toString()}`);
  };

  useEffect(() => {
    if (initialRender && searchParams?.get('tab')) {
      setInitialRender(false);

      let sectionId;
      switch (activeTab) {
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
          sectionId = 'project-progress-tab';
      }

      const section = document.getElementById(sectionId)?.offsetTop;
      if (section) {
        window.scrollTo({
          top: section,
          behavior: 'smooth',
        });
      }
    }
  }, [activeTab, initialRender, searchParams]);

  useEffect(() => {
    const tabQueryParam = searchParams?.get('tab');
    if (tabQueryParam && activeTab !== Number(tabQueryParam)) {
      setActiveTab(Number(tabQueryParam));
    }
  }, [searchParams, activeTab]);

  const containerStyles: SxProps = {
    width: '85%',
    maxWidth: '1200px',
    padding: 0,
    [theme.breakpoints.down('md')]: {
      width: '90%',
    },
  };

  return (
    <Box sx={containerStyles} id="moredetails">
      <CustomTabs
        value={activeTab}
        onChange={handleChange}
        aria-label="tab switcher"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
      >
        <CustomTab
          label={
            <Typography variant="subtitle1" sx={{ fontSize: '22px' }}>
              {m.components_projectdetails_tabView_innoInfos()}
            </Typography>
          }
          id="tab-project-progress"
          aria-controls="project-progress-tab"
        />
        <CustomTab
          label={
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle1" color="secondary.main" sx={{ fontSize: '22px' }}>
                {collaborationActivities}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '22px' }}>
                {m.components_projectdetails_tabView_collaboration()}
              </Typography>
            </Stack>
          }
          id="tab-collaboration"
          aria-controls="collaboration-tab"
        />
        <CustomTab
          label={
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle1" color="secondary.main" sx={{ fontSize: '22px' }}>
                {updates.length}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '22px' }}>
                {m.components_projectdetails_tabView_news()}
              </Typography>
            </Stack>
          }
          id="tab-updates"
          aria-controls="updates-tab"
        />
        <CustomTab
          label={
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle1" color="secondary.main" sx={{ fontSize: '22px' }}>
                {futureEvents?.length}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '22px' }}>
                {m.components_projectdetails_tabView_events()}
              </Typography>
            </Stack>
          }
          id="tab-events"
          aria-controls="events-tab"
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
