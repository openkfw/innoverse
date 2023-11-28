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
    description: `Der Vorstand hat uns beauftragt, Anwendungsfälle für Generative Ki in ***STRING_REMOVED***  zu erheben und zu bewerten, sowie parallel die benötigten IT Skills, Tools und Prozesse aufzusetzen.`,
  },
];

interface TimingDataProps {
  projectStart: string;
}

const ProjectStageCard = (props: TimingDataProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { projectStart } = props;

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <Typography variant="overline" sx={{ textAlign: 'center', color: 'primary.light' }}>
        Projekt Info & Status
      </Typography>
      <Card sx={cardStyles}>
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
                          {projectStart}
                        </Typography>
                      ) : null}
                    </Grid>
                  </Grid>
                </StepLabel>
                <StepContent>
                  {!isCollapsed ? (
                    <>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {step.description.slice(0, 120)}
                      </Typography>
                      <Button
                        onClick={handleToggle}
                        variant="outlined"
                        sx={buttonStyles}
                        startIcon={<AddIcon color="secondary" fontSize="small" />}
                      >
                        <Typography variant="subtitle2">weiterlesen</Typography>
                      </Button>
                    </>
                  ) : (
                    <Collapse in={isCollapsed}>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
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

// Project stage card Styles

const cardStyles = {
  backgroundColor: '#F0EEE1',
  borderRadius: '24px',
  width: '350px',
  height: '370px',
  marginTop: 1,
};

const buttonStyles = {
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
};
