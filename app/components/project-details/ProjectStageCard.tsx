import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { Button, Collapse, Grid, Step, StepContent, StepIcon, StepIconProps, StepLabel, Stepper } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const steps = [
  {
    label: 'Exploration',
    description: `***STRING_REMOVED***  richtet ihr eigenes Investitionsverhalten auf Nachhaltigkeit aus. Seit 2006 ist sie Unterzeichnerin der UN Principles for Responsible Investment (PRI). Nachhaltigkeitskriterien w`,
  },
  {
    label: 'Konzeption',
    description:
      '***STRING_REMOVED***  richtet ihr eigenes Investitionsverhalten auf Nachhaltigkeit aus. Seit 2006 ist sie Unterzeichnerin der UN Principles for Responsible Investment (PRI). Nachhaltigkeitskriterien w',
  },
  {
    label: 'PoC',
    description: `***STRING_REMOVED***  richtet ihr eigenes Investitionsverhalten auf Nachhaltigkeit aus. Seit 2006 ist sie Unterzeichnerin der UN Principles for Responsible Investment (PRI). Nachhaltigkeitskriterien w`,
  },
];

interface TimingDataProps {
  timingData: {
    projectStart: string;
    projectEnd: string;
  };
}

const ProjectStageCard = (props: TimingDataProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { projectStart, projectEnd } = props.timingData;

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <Typography variant="overline" sx={{ textAlign: 'center', color: 'primary.light', mb: '25px' }}>
        Project Info & Status
      </Typography>
      <Card
        sx={{
          backgroundColor: '#F0EEE1',
          borderRadius: '24px',
          width: '350px',
        }}
      >
        <CardContent>
          <Stepper nonLinear activeStep={2} orientation="vertical">
            {steps.map((step, index) => (
              <Step sx={{ color: 'secondary' }} key={step.label}>
                <StepLabel StepIconComponent={CustomStepIcon}>
                  <Grid container>
                    <Grid item xs={4}>
                      <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                        {step.label}
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      {index == 2 ? (
                        <Typography
                          variant="subtitle1"
                          sx={{ color: 'text.primary', display: 'flex', flexDirection: 'row-reverse' }}
                        >
                          {projectStart} - {projectEnd}
                        </Typography>
                      ) : null}
                    </Grid>
                  </Grid>
                </StepLabel>
                <StepContent>
                  {!isCollapsed ? (
                    <>
                      <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                        {step.description.slice(0, 60)}
                      </Typography>
                      <Button
                        onClick={handleToggle}
                        variant="outlined"
                        sx={{
                          border: 'none',
                          background: 'none',
                          '&:hover': {
                            border: 'none',
                            background: 'none',
                          },
                          '&:active': {
                            border: 'none',
                            background: 'none',
                          },
                        }}
                        startIcon={<AddIcon color="secondary" fontSize="small" />}
                      >
                        <Typography variant="subtitle2">weiter lesen</Typography>
                      </Button>
                    </>
                  ) : (
                    <Collapse in={isCollapsed}>
                      <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                        {step.description}
                      </Typography>
                    </Collapse>
                  )}
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>
    </>
  );
};

const CustomStepIcon = (props: StepIconProps) => {
  return <StepIcon {...props} style={{ color: '#A4B419' }} />;
};

export default ProjectStageCard;
