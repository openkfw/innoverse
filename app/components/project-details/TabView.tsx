import * as React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled, SxProps } from '@mui/material/styles';
import Tab, { TabProps } from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import triggerAnalyticsEvent from '@/analytics/analytics';
import { Project } from '@/common/types';
import theme from '@/styles/theme';

import { CollaborationTab } from '../collaboration/CollaborationTab';
import { UpdatesTab } from '../updates/UpdatesTab';

import { countFutureEventsForProject } from './events/actions';
import { EventsTab } from './events/EventsTab';
import { ProjectProgress } from './ProjectProgress';

interface TabPanelProps {
  children?: React.ReactNode;
  id: string;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, id, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={id} aria-labelledby={`tab-${id}`} {...other}>
      <Box sx={{ paddingTop: 3 }}>{children}</Box>
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
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

const CustomTab = styled((props: TabProps) => <Tab disableRipple {...props} />)(({ theme }) => ({
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
  activeTab: number;
  setActiveTab: (tab: number) => void;
  projectName: string;
}

export default function TabView(props: BasicTabsProps) {
  const { project, activeTab, setActiveTab, projectName } = props;
  const { opportunities, questions, collaborationQuestions, updates } = project;
  const collaborationActivities = opportunities.length + questions.length + collaborationQuestions.length;
  const [futureEventCount, setFutureEventCount] = React.useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        triggerAnalyticsEvent('tab-projektverlauf-clicked', projectName);
      case 1:
        triggerAnalyticsEvent('tab-zusammernarbeit-clicked', projectName);
      case 2:
        triggerAnalyticsEvent('tab-updates-clicked', projectName);
      case 3:
        triggerAnalyticsEvent('tab-events-clicked', projectName);
    }
    setActiveTab(newValue);
  };

  React.useEffect(() => {
    const getFutureEventCount = async () => {
      const { data: result } = await countFutureEventsForProject({ projectId: project.id });
      if (result) {
        setFutureEventCount(result);
      }
    };
    getFutureEventCount();
  }, [project]);

  const containerStyles: SxProps = {
    width: '85%',
    maxWidth: '1200px',
    padding: 0,
    [theme.breakpoints.down('md')]: {
      width: '90%',
    },
  };

  return (
    <Box sx={containerStyles}>
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
              Inno-Infos
            </Typography>
          }
          {...a11yProps(0)}
        />
        <CustomTab
          label={
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle1" color="secondary.main" sx={{ fontSize: '22px' }}>
                {collaborationActivities}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '22px' }}>
                Zusammenarbeit
              </Typography>
            </Stack>
          }
          {...a11yProps(1)}
        />
        <CustomTab
          label={
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle1" color="secondary.main" sx={{ fontSize: '22px' }}>
                {updates.length}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '22px' }}>
                Updates
              </Typography>
            </Stack>
          }
          {...a11yProps(2)}
        />
        <CustomTab
          label={
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle1" color="secondary.main" sx={{ fontSize: '22px' }}>
                {futureEventCount.toString()}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '22px' }}>
                Events
              </Typography>
            </Stack>
          }
          {...a11yProps(3)}
        />
      </CustomTabs>
      <CustomTabPanel value={activeTab} index={0} id="project-progress-tab">
        <ProjectProgress project={project} projectName={projectName} />
      </CustomTabPanel>
      <CustomTabPanel value={activeTab} index={1} id="collaboration-tab">
        <CollaborationTab project={project} />
      </CustomTabPanel>
      <CustomTabPanel value={activeTab} index={2} id="updates-tab">
        <UpdatesTab projectId={project.id} />
      </CustomTabPanel>
      <CustomTabPanel value={activeTab} index={3} id="tabpanel-0">
        <EventsTab projectId={project.id} />
      </CustomTabPanel>
    </Box>
  );
}
