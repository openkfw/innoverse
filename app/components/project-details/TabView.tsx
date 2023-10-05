import * as React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Tab, { TabProps } from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import triggerAnalyticsEvent from '@/analytics/analytics';
import { ProjectStatus, UpdateContent } from '@/common/types';

import { CollaborationTab } from '../collaboration/CollaborationTab';
import { UpdatesTab } from '../updates/UpdatesTab';

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
      {value === index && <Box sx={{ paddingTop: 3 }}>{children}</Box>}
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
  '& .MuiTabs-indicator': {
    backgroundColor: '#FFF',
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
  updates: UpdateContent[];
  projectStatus: ProjectStatus;
  activeTab: number;
  setActiveTab: (tab: number) => void;
  projectName: string;
}

export default function BasicTabs(props: BasicTabsProps) {
  const { updates, projectStatus, activeTab, setActiveTab, projectName } = props;
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        triggerAnalyticsEvent('tab-projektverlauf-clicked', projectName);
      case 1:
        triggerAnalyticsEvent('tab-zusammernarbeit-clicked', projectName);
      case 2:
        triggerAnalyticsEvent('tab-updates-clicked', projectName);
    }
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" style={{ padding: 0, minWidth: '1280px' }}>
      <Box sx={{ marginLeft: '64px', display: 'inline-flex', borderBottom: '1px', borderColor: 'main' }}>
        <CustomTabs value={activeTab} onChange={handleChange} aria-label="tab switcher">
          <CustomTab
            label={
              <Typography variant="subtitle1" sx={{ fontSize: '22px' }}>
                Projektverlauf
              </Typography>
            }
            {...a11yProps(0)}
          />
          <CustomTab
            label={
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1" color="secondary.main" sx={{ fontSize: '22px' }}>
                  3
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
        </CustomTabs>
      </Box>
      <CustomTabPanel value={activeTab} index={0} id="tabpanel-0">
        <ProjectProgress projectStatus={projectStatus} projectName={projectName} />
      </CustomTabPanel>
      <CustomTabPanel value={activeTab} index={1} id="collaboration-tab">
        <CollaborationTab />
      </CustomTabPanel>
      <CustomTabPanel value={activeTab} index={2} id="tabpanel-0">
        <UpdatesTab updates={updates} />
      </CustomTabPanel>
    </Container>
  );
}
