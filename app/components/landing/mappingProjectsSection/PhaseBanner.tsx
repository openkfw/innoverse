import { PropsWithChildren } from 'react';

import Box from '@mui/material/Box';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import theme from '@/styles/theme';

import { ArrowBanner, ConnectingArrowBanner } from './ArrowBanner';

type PhaseBannerProps = PropsWithChildren & {
  isFirstPhase?: boolean;
  sx?: SxProps;
};
export const PhaseBanner = ({ isFirstPhase, children, sx }: PhaseBannerProps) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.down('xl'));
  const bannerSize = isSmallScreen ? 'small' : isLargeScreen ? 'regular' : 'large';

  return (
    <Box
      sx={{
        ...bannerContainerStyles,
        ...sx,
        justifyContent: isSmallScreen ? 'flex-start' : 'center',
      }}
    >
      <Box style={{ height: 64, flexShrink: 0 }}>
        {isFirstPhase ? <ArrowBanner size={bannerSize} /> : <ConnectingArrowBanner size={bannerSize} />}
      </Box>
      <Box sx={{ position: 'absolute' }}>
        <Typography variant="h6" sx={{ ...bannerTextStyles, marginLeft: isSmallScreen ? '30px' : '0px' }}>
          {children}
        </Typography>
      </Box>
    </Box>
  );
};

const bannerContainerStyles = {
  display: 'inline-flex',
  alignItems: 'center',
};

const bannerTextStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  color: 'text.primary',
  gap: 2,
};
