import * as React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Tab, { TabProps } from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import { ProjectProgress } from './ProjectProgress';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
  borderBottom: '1px solid #e8e8e8',
  '& .MuiTabs-indicator': {
    backgroundColor: '#FFF',
  },
});

const CustomTab = styled((props: TabProps) => <Tab disableRipple {...props} />)(({ theme }) => ({
  minWidth: 0,
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  color: 'rgba(242, 242, 242, 0.85)',
  '&:hover': {
    color: '#FFF',
    opacity: 1,
  },
  '&.Mui-selected': {
    color: '#FFF',
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '85%' }}>
      <Box sx={{ borderBottom: 0.1, borderColor: 'main' }}>
        <CustomTabs value={value} onChange={handleChange} aria-label="tab switcher">
          <CustomTab label={<Typography variant="subtitle1">Projektverlauf</Typography>} {...a11yProps(0)} />
          <CustomTab
            label={
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1" color="secondary.main">
                  12
                </Typography>
                <Typography variant="subtitle1">Zusammenarbeit</Typography>
              </Stack>
            }
            {...a11yProps(1)}
          />
          <CustomTab
            disabled
            label={
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1" color="secondary.main">
                  3
                </Typography>
                <Typography variant="subtitle1">Updates</Typography>
              </Stack>
            }
            {...a11yProps(2)}
          />
        </CustomTabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <ProjectProgress />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Typography>ToDo</Typography>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Typography>ToDo</Typography>
      </CustomTabPanel>
    </Box>
  );
}
