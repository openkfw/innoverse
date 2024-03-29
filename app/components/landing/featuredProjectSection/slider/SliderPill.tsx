import { ReactNode, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
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

const ActiveSliderPill = (props: { itemNumber: string; title: string; projectStart: string }) => {
  const { itemNumber, title, projectStart } = props;
  const styles = {
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
    <Stack sx={styles.activeContainer}>
      <Box sx={styles.vr} />
      <Stack direction="row">
        <Stack>
          <PillBox sx={{ pl: '13px', pr: '24px' }}>
            <Typography variant="overline">Project #{itemNumber}</Typography>
          </PillBox>
          <PillBox sx={{ pl: '13px', pr: '24px', borderTop: 0 }}>
            <Typography variant="overline">{projectStart}</Typography>
          </PillBox>
        </Stack>
        <PillBox sx={{ px: '32px', borderLeft: 0 }}>
          <Typography variant="h4" sx={{ wordWrap: 'break-word' }}>
            {title}
          </Typography>
        </PillBox>
      </Stack>
    </Stack>
  );
};

const NonActiveSliderPill = (props: { itemNumber: string; title: string; projectStart: string }) => {
  const { itemNumber, title } = props;
  const [hover, setHover] = useState<boolean>(false);

  const pillBoxStyle = {
    ...{ px: '7px' },
    ...(hover && {
      borderColor: 'action.hover',
      '& .MuiTypography-root': {
        color: 'action.hover',
      },
    }),
  };

  return (
    <Stack
      direction="row"
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => setHover(false)}
    >
      <PillBox sx={pillBoxStyle}>
        <Typography variant="overline">#{itemNumber}</Typography>
      </PillBox>
      <PillBox sx={pillBoxStyle}>
        <Typography variant="h6" noWrap>
          {title}
        </Typography>
      </PillBox>
    </Stack>
  );
};

const SliderPill = (props: { active: boolean; itemNumber: string; title: string; projectStart: string }) => {
  const { active } = props;
  return <>{active ? <ActiveSliderPill {...props} /> : <NonActiveSliderPill {...props} />}</>;
};

export default SliderPill;
