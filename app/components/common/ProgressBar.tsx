'use client';

import { CSSProperties } from 'react';

import Box from '@mui/material/Box';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { PROJECT_PROGRESS } from '@/common/types';

import theme from '../../styles/theme';

import CustomTooltip from './CustomTooltip';

interface ProgressBarProps {
  active: string;
}

interface ProgressStepProps {
  idx: number;
  step: string;
  activeStep: string;
}

const getStepIndex = (step: string) => {
  switch (step) {
    case PROJECT_PROGRESS.EXPLORATION:
      return 1;
    case PROJECT_PROGRESS.KONZEPTION:
      return 2;
    case PROJECT_PROGRESS.PROOF_OF_CONCEPT:
      return 3;
    case PROJECT_PROGRESS.LIVE:
      return 4;
    default:
      return -1;
  }
};

const getStepLabel = (step: string) => {
  return step.replace(/_/g, ' ');
};

const getStepStatusLabel = (stepIsDone: boolean, active: boolean) => {
  return stepIsDone ? 'abgeschlossen' : active ? 'in Arbeit' : 'ausstehend';
};

const isStepDone = (stepIdx: number, activeStep: string) => {
  const activeStepIdx = getStepIndex(activeStep);
  const stepIsDone = activeStepIdx > stepIdx;
  return stepIsDone;
};

const isLive = (step: string) => {
  return step === PROJECT_PROGRESS.LIVE;
};

interface ProgressStepLabelProps {
  label: string;
  sx?: SxProps;
}

function ActiveStepLabel({ label, sx }: ProgressStepLabelProps) {
  return (
    <Box sx={sx}>
      <Box
        sx={{
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
          height: 28,
          px: 0.5,
          backgroundColor: isLive(label) ? theme.palette.secondary.main : '#B7F9AA',
        }}
      >
        {isLive(label) ? (
          <Box
            style={{
              width: 24,
              height: 24,
              background: theme.palette.primary.main,
              borderRadius: 100,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
              <path
                d="M4.41447 8.35512L1.12139 5.06204L0 6.17553L4.41447 10.59L13.891 1.11349L12.7775 0L4.41447 8.35512Z"
                fill="white"
              />
            </svg>
          </Box>
        ) : (
          <Box
            style={{
              width: 24,
              height: 24,
              background: '#41484C',
              borderRadius: 100,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.12153 5.58067V4.1789C4.87798 4.17534 2.87443 5.78689 2.45132 8.09266C2.03266 10.3709 3.28243 12.6189 5.42287 13.4384C6.03531 13.6731 6.34287 14.3629 6.11087 14.9815C5.90464 15.5309 5.3402 15.8375 4.7882 15.7344C4.71887 15.722 4.64954 15.7024 4.58198 15.6766C1.36866 14.4482 -0.507778 11.0749 0.120664 7.658C0.755329 4.20112 3.75887 1.79313 7.12153 1.79757V0.635796C7.12153 0.078465 7.82286 -0.208645 8.24775 0.176242L10.9802 2.64823C11.2566 2.8989 11.2566 3.31845 10.9802 3.56912L8.24775 6.04111C7.82286 6.42511 7.12153 6.13889 7.12153 5.58067ZM8.68864 13.4766C8.51264 13.5406 8.3313 13.594 8.14819 13.6349C7.50908 13.778 7.10464 14.4171 7.24597 15.0624C7.35175 15.546 7.73397 15.8953 8.1873 15.9806C8.3393 16.0082 8.4993 16.0073 8.6593 15.9717C8.93841 15.9086 9.21308 15.8286 9.48152 15.7326C10.0975 15.5113 10.4211 14.826 10.2024 14.2038C9.98285 13.5806 9.30374 13.2553 8.68864 13.4766ZM11.0451 11.6358C10.9944 11.7122 10.942 11.7869 10.886 11.8598C10.4869 12.3833 10.5829 13.1344 11.102 13.538C11.2566 13.6571 11.4291 13.7326 11.6086 13.7655C12.0317 13.8446 12.4833 13.6873 12.7651 13.3184C12.8495 13.2064 12.9322 13.0909 13.0113 12.9726C13.3766 12.4242 13.2335 11.6811 12.6913 11.3113C12.1482 10.9442 11.4113 11.0873 11.0451 11.6358ZM13.0682 7.96466C12.414 7.94688 11.8682 8.49177 11.8513 9.1531C11.8353 9.74777 12.2531 10.2438 12.8148 10.3487C12.8753 10.3602 12.9384 10.3673 13.0015 10.3682C13.6548 10.3878 14.2006 9.8571 14.2211 9.19666C14.2211 9.19488 14.2219 9.17088 14.2219 9.1691C14.2397 8.50777 13.718 7.97622 13.0682 7.96466Z"
                fill="white"
              />
            </svg>
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: 14,
              fontFamily: 'SansHeadingsMed',
              color: isLive(label) ? 'text.primary' : 'common.black',
            }}
          >
            {label}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function StepLabel({
  label,
  sx,
  backgroundColor,
}: ProgressStepLabelProps & { backgroundColor: CSSProperties['backgroundColor'] }) {
  return (
    <Box style={{ position: 'absolute' }} sx={sx}>
      <Box
        style={{
          width: 24,
          height: 24,
          background: backgroundColor,
          borderRadius: 100,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" color="common.white">
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

function FirstStep({ idx, step, activeStep }: ProgressStepProps) {
  const active = activeStep === step;
  const label = getStepLabel(step);
  const stepIsDone = isStepDone(idx, activeStep);
  const statusLabel = getStepStatusLabel(stepIsDone, active);

  return (
    <CustomTooltip tooltip={`${label}: ${statusLabel}`}>
      <Box sx={stepStyles}>
        {active ? (
          <>
            <svg
              style={{ padding: 0 }}
              width="6"
              height="28"
              viewBox="0 0 5 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.77735 0H4.00745C0.669682 0 -1.19995 3.8468 0.862187 6.47131L4.83582 11.5287C5.97547 12.9791 5.97547 15.0209 4.83582 16.4713L0.862187 21.5287C-1.19995 24.1532 0.669682 28 4.00745 28H5.77735V0Z"
                fill={isLive(step) ? theme.palette.secondary.main : '#B7F9AA'}
              />
            </svg>

            <ActiveStepLabel label={label} />

            <svg
              style={{ padding: 0 }}
              width="14"
              height="28"
              viewBox="1 0 14 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.777344 28H0.887817C2.05237 28 3.15906 27.4926 3.91895 26.6101L12.53 16.6101C13.8219 15.1099 13.8219 12.8901 12.53 11.3899L3.91895 1.38989C3.15906 0.507446 2.05237 0 0.887817 0H0.777344V28Z"
                fill={isLive(step) ? theme.palette.secondary.main : '#B7F9AA'}
              />
            </svg>
          </>
        ) : (
          <>
            <StepLabel label={idx.toString()} backgroundColor={theme.palette.primary.main} sx={{ mr: 0.5 }} />
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="28" viewBox="0 0 38 28" fill="none">
              <path
                d="M0 4C0 1.79086 1.79086 0 4 0H25.1102C26.2747 0 27.3814 0.507478 28.1413 1.38991L36.7524 11.3899C38.0443 12.8902 38.0443 15.1098 36.7524 16.6101L28.1413 26.6101C27.3814 27.4925 26.2747 28 25.1102 28H4C1.79086 28 0 26.2091 0 24V4Z"
                fill={stepIsDone ? theme.palette.secondary.main : '#6D767D'}
              />
            </svg>
          </>
        )}
      </Box>
    </CustomTooltip>
  );
}

function Step({ idx, step, activeStep }: ProgressStepProps) {
  const active = activeStep === step;
  const label = getStepLabel(step);
  const stepIsDone = isStepDone(idx, activeStep);
  const statusLabel = getStepStatusLabel(stepIsDone, active);

  return (
    <CustomTooltip tooltip={`${label}: ${statusLabel}`}>
      <Box sx={stepStyles}>
        {active ? (
          <>
            <svg
              shapeRendering={'crispEdges'}
              style={{ padding: 0, marginRight: 0 }}
              width="6"
              height="28"
              viewBox="0 0 5 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="blur">
                  <feGaussianBlur stdDeviation="0.5" />
                </filter>
              </defs>
              <path
                d="M5.77735 0H4.00745C0.669682 0 -1.19995 3.8468 0.862187 6.47131L4.83582 11.5287C5.97547 12.9791 5.97547 15.0209 4.83582 16.4713L0.862187 21.5287C-1.19995 24.1532 0.669682 28 4.00745 28H5.77735V0Z"
                fill={isLive(step) ? theme.palette.secondary.main : '#B7F9AA'}
              />
            </svg>

            <ActiveStepLabel label={label} />

            <svg
              style={{ marginRight: 0, marginLeft: 0, padding: 0 }}
              shapeRendering={'crispEdges'}
              width="14"
              height="28"
              viewBox="1 0 14 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="blur">
                  <feGaussianBlur stdDeviation="0.5" />
                </filter>
              </defs>
              <path
                d="M0.777344 28H0.887817C2.05237 28 3.15906 27.4926 3.91895 26.6101L12.53 16.6101C13.8219 15.1099 13.8219 12.8901 12.53 11.3899L3.91895 1.38989C3.15906 0.507446 2.05237 0 0.887817 0H0.777344V28Z"
                fill={isLive(step) ? theme.palette.secondary.main : '#B7F9AA'}
              />
            </svg>
          </>
        ) : (
          <>
            <StepLabel label={idx.toString()} backgroundColor={stepIsDone ? theme.palette.primary.main : '#41484C'} />
            <svg xmlns="http://www.w3.org/2000/svg" width="43" height="28" viewBox="0 0 43 28" fill="none">
              <path
                d="M1.08458 6.47128C-0.97754 3.84677 0.892128 0 4.22985 0H30.1102C31.2748 0 32.3814 0.507478 33.1413 1.38991L41.7524 11.3899C43.0443 12.8902 43.0443 15.1098 41.7524 16.6101L33.1413 26.6101C32.3814 27.4925 31.2747 28 30.1102 28H4.22986C0.892129 28 -0.977536 24.1532 1.08458 21.5287L5.05828 16.4713C6.19791 15.0208 6.19791 12.9792 5.05828 11.5287L1.08458 6.47128Z"
                fill={stepIsDone ? theme.palette.secondary.main : '#6D767D'}
              />
            </svg>
          </>
        )}
      </Box>
    </CustomTooltip>
  );
}

export default function ProgressBar({ active }: ProgressBarProps) {
  return (
    <Box sx={wrapperStyles}>
      <FirstStep idx={1} step={PROJECT_PROGRESS.EXPLORATION} activeStep={active} />
      <Step idx={2} step={PROJECT_PROGRESS.KONZEPTION} activeStep={active} />
      <Step idx={3} step={PROJECT_PROGRESS.PROOF_OF_CONCEPT} activeStep={active} />
      <Step idx={4} step={PROJECT_PROGRESS.LIVE} activeStep={active} />
    </Box>
  );
}

// Progress Bar Styles
const wrapperStyles = {
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  display: 'inline-flex',
  width: 300,
};

const stepStyles = {
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'default',
};
