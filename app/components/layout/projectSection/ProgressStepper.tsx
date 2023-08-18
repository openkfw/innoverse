import * as React from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import { StepIconProps } from "@mui/material/StepIcon";

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.primary.main,
  zIndex: 1,
  color: "#fff",
  width: 60,
  height: 25,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage: theme.palette.secondary.main,
  }),
}));

function StepIcon(props: StepIconProps) {
  const { active, className } = props;

  return (
    <ColorlibStepIconRoot ownerState={{ active }} className={className}>
      {props.icon}
    </ColorlibStepIconRoot>
  );
}

export const PROJECT_PROGRESS = {
  EXPLORATION: "Exploration",
  KONZEPTION: "Konzeption",
  PROOF_OF_CONCEPT: "Proof of Concept",
};

const steps = [
  PROJECT_PROGRESS.EXPLORATION,
  PROJECT_PROGRESS.KONZEPTION,
  PROJECT_PROGRESS.PROOF_OF_CONCEPT,
];

interface ProgressStepperProps {
  progress: any;
}

export default function ProgressStepper(props: ProgressStepperProps) {
  const { progress } = props;

  return (
    <Stack sx={{ width: "100%" }} spacing={4}>
      <Stepper
        alternativeLabel
        activeStep={steps.indexOf(progress)}
        connector={null}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={StepIcon} />
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}
