'use client';

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

import { PROJECT_PROGRESS } from '@/common/types';

import theme from '../../styles/theme';

interface ProgressBarProps {
  active: string;
}

interface ProgressStepProps {
  id: string;
  label: string;
  active: boolean;
}

interface ProgressStepLabelProps {
  label: string;
}

function ActiveStepLabel({ label }: ProgressStepLabelProps) {
  return (
    <Box
      style={{
        position: 'absolute',
        top: 1,
      }}
    >
      <Box sx={{ display: 'inline-flex', gap: 1 }}>
        <Box
          style={{
            width: 24,
            height: 24,
            background: '#2D3134CC',
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ fontSize: 14 }}>
            {label}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function StepLabel({ label }: ProgressStepLabelProps) {
  return (
    <Box
      style={{
        position: 'absolute',
      }}
    >
      <Box
        style={{
          width: 24,
          height: 24,
          background: '#2D3134CC',
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

function FirstStep({ id, label, active }: ProgressStepProps) {
  return (
    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {active ? (
        <>
          <ActiveStepLabel label={label} />
          <svg xmlns="http://www.w3.org/2000/svg" width="159" height="28" viewBox="0 0 159 28" fill="none">
            <path
              d="M1.08458 6.47128C-0.97754 3.84677 0.892129 0 4 0H146.11C147.275 0 148.381 0.507478 149.141 1.38991L157 11.3899C159.044 12.8902 159.044  15.1098 157.752 16.6101L149.141 26.6101C27.3814 27.4925 26.2747 28 25.1102 28H4C1.79086 28 0 26.2091 0 24V4Z"
              fill="black"
              fillOpacity="0.56"
            />
          </svg>
        </>
      ) : (
        <>
          <StepLabel label={id} />
          <svg xmlns="http://www.w3.org/2000/svg" width="38" height="28" viewBox="0 0 38 28" fill="none">
            <path
              d="M0 4C0 1.79086 1.79086 0 4 0H25.1102C26.2747 0 27.3814 0.507478 28.1413 1.38991L36.7524 11.3899C38.0443 12.8902 38.0443 15.1098 36.7524 16.6101L28.1413 26.6101C27.3814 27.4925 26.2747 28 25.1102 28H4C1.79086 28 0 26.2091 0 24V4Z"
              fill={theme.palette.secondary.main}
            />
          </svg>
        </>
      )}
    </Box>
  );
}

function Step({ id, label, active }: ProgressStepProps) {
  return (
    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {active ? (
        <>
          <ActiveStepLabel label={label} />
          <svg xmlns="http://www.w3.org/2000/svg" width="159" height="28" viewBox="0 0 159 28" fill="none">
            <path
              d="M1.08458 6.47128C-0.97754 3.84677 0.892129 0 4.22986 0H146.11C147.275 0 148.381 0.507479 149.141 1.38991L157.752 11.3899C159.044 12.8902 159.044 15.1098 157.752 16.6101L149.141 26.6101C148.381 27.4925 147.275 28 146.11 28H4.22986C0.892138 28 -0.977536 24.1532 1.08458 21.5287L5.05828 16.4713C6.19791 15.0208 6.19791 12.9792 5.05828 11.5287L1.08458 6.47128Z"
              fill="black"
              fillOpacity="0.56"
            />
          </svg>
        </>
      ) : (
        <>
          <StepLabel label={id} />
          <svg xmlns="http://www.w3.org/2000/svg" width="43" height="28" viewBox="0 0 43 28" fill="none">
            <path
              d="M1.08458 6.47128C-0.97754 3.84677 0.892128 0 4.22985 0H30.1102C31.2748 0 32.3814 0.507478 33.1413 1.38991L41.7524 11.3899C43.0443 12.8902 43.0443 15.1098 41.7524 16.6101L33.1413 26.6101C32.3814 27.4925 31.2747 28 30.1102 28H4.22986C0.892129 28 -0.977536 24.1532 1.08458 21.5287L5.05828 16.4713C6.19791 15.0208 6.19791 12.9792 5.05828 11.5287L1.08458 6.47128Z"
              fill={theme.palette.secondary.main}
            />
          </svg>
        </>
      )}
    </Box>
  );
}

export default function ProgressBar({ active }: ProgressBarProps) {
  return (
    <Box sx={{ justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex' }}>
      <FirstStep id="1" label={PROJECT_PROGRESS.EXPLORATION} active={active == PROJECT_PROGRESS.EXPLORATION} />
      <Step id="2" label={PROJECT_PROGRESS.KONZEPTION} active={active == PROJECT_PROGRESS.KONZEPTION} />
      <Step
        id="3"
        label={PROJECT_PROGRESS.PROOF_OF_CONCEPT.replace(/_/g, ' ')}
        active={active == PROJECT_PROGRESS.PROOF_OF_CONCEPT}
      />
      <Step id="4" label={PROJECT_PROGRESS.LIVE} active={active == PROJECT_PROGRESS.LIVE} />
    </Box>
  );
}
