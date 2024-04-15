import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Project } from '@/common/types';
import { MappingDataProps } from '@/components/landing/mappingProjectsSection/MappingProjectsCard';
import theme from '@/styles/theme';

import { PhaseBanner } from './PhaseBanner';
import { ProjectLinks } from './ProjectLinks';

interface PhaseColumnsProps {
  mappingData: MappingDataProps[];
  projects: Project[];
}

export default function PhaseColumns(props: PhaseColumnsProps) {
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  return isLargeScreen ? <LargeScreenLayout {...props} /> : <MobileLayout {...props} />;
}

const LargeScreenLayout = ({ mappingData, projects }: PhaseColumnsProps) => {
  return (
    <>
      <Grid container spacing={2}>
        {mappingData.map((data, idx) => (
          <Grid key={idx} item xs={12} md={12} lg={4}>
            <PhaseColumnHeader {...data} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        {mappingData.map(({ title: phaseName }, idx) => (
          <Grid key={idx} item xs={12} md={12} lg={4}>
            <PhaseColumFooter projects={projects} phaseName={phaseName} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

const MobileLayout = ({ mappingData, projects }: PhaseColumnsProps) => {
  return (
    <Grid container spacing={2}>
      {mappingData.map((data, idx) => (
        <Grid key={idx} item xs={12} md={12} lg={4}>
          <PhaseColumnHeader {...data} />
          <PhaseColumFooter projects={projects} phaseName={data.title} />
        </Grid>
      ))}
    </Grid>
  );
};

const PhaseColumnHeader = ({ title, description, icon, isFirstStep }: MappingDataProps) => {
  return (
    <>
      <PhaseBanner isFirstPhase={isFirstStep} sx={{ marginBottom: 4 }}>
        {icon}
        {title}
      </PhaseBanner>
      <Typography variant="subtitle1">{description}</Typography>
    </>
  );
};

const PhaseColumFooter = ({ phaseName, projects }: { projects: Project[]; phaseName: string }) => {
  const getProjectsInPhase = (phase: string) => projects.filter((p) => p.status.replace(/_/g, ' ') === phase);

  return (
    <Box sx={{ marginBottom: { xs: 3, lg: 0 } }}>
      <Divider sx={{ my: 3, height: '1px', opacity: 0.2, borderColor: 'white' }} />
      <ProjectLinks projects={getProjectsInPhase(phaseName)} />
    </Box>
  );
};
