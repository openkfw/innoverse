import { ReactNode } from 'react';

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

const SliderPill = (props: { itemNumber: string; title: string }) => {
  const { itemNumber, title } = props;

  return (
    <Stack sx={activeContainer} direction="row">
      <Stack>
        <PillBox sx={{ pl: '7px', pr: '7px' }}>
          <Typography variant="overline" noWrap>
            #{itemNumber}
          </Typography>
        </PillBox>
      </Stack>
      <PillBox sx={{ px: 3 }}>
        <Typography variant="h4" sx={titleStyles}>
          {title}
        </Typography>
      </PillBox>
    </Stack>
  );
};

export default SliderPill;

// Small Slider Pill Styles
const activeContainer = {
  position: 'relative',
};

const titleStyles = {
  fontSize: 24,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 'calc(100vw - 170px)',
};
