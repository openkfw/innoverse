import { ReactNode } from 'react';

import { SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const PillBox = ({ children, sx }: { children: ReactNode; sx?: SxProps }) => {
  const style = {
    border: '0.50px white solid',
    px: '10px',
    py: '1px',
    display: 'flex',
    alignItems: 'center',
    ...sx,
  };
  return <Box sx={style}>{children}</Box>;
};

const SliderPill = (props: { active: boolean; itemNumber: string; title: string; projectStart: string }) => {
  const { active, itemNumber, title, projectStart } = props;

  const styles = {
    elementWrap: {
      border: '0.50px white solid',
      px: '10px',
      py: '1px',
      display: 'flex',
      alignItems: 'center',
    },
    activeContainer: {
      position: 'relative',
    },
    vr: {
      position: 'absolute',
      bottom: '100%',
      borderLeft: '1px solid white',
      height: '0px',
      marginLeft: '50%',
      zIndex: 0,
      animation: 'grow 1s ease forwards',
      '@keyframes grow': {
        from: { height: 0 },
        to: { height: '200px' },
      },
    },
  };

  return (
    <>
      {active ? (
        <Stack sx={styles.activeContainer}>
          <Box sx={styles.vr} />
          <Stack direction="row">
            <Stack>
              <PillBox sx={{ pl: '13px', pr: '24px' }}>
                <Typography variant="overline">Project #{itemNumber}</Typography>
              </PillBox>
              <PillBox sx={{ pl: '13px', pr: '24px' }}>
                <Typography variant="overline">{projectStart}</Typography>
              </PillBox>
            </Stack>
            <PillBox sx={{ px: '32px' }}>
              <Typography variant="h4" sx={{ wordWrap: 'break-word' }}>
                {title}
              </Typography>
            </PillBox>
          </Stack>
        </Stack>
      ) : (
        <Stack direction="row">
          <PillBox sx={{ px: '7px' }}>
            <Typography variant="overline">#{itemNumber}</Typography>
          </PillBox>
          <PillBox sx={{ px: '17px' }}>
            <Typography variant="h6" noWrap>
              {title}
            </Typography>
          </PillBox>
        </Stack>
      )}
    </>
  );
};

export default SliderPill;
