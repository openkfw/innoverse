// eslint-disable-next-line no-restricted-imports
import Box from '@mui/material/Box/Box';

import classes from './BackgroundArrows.module.css';

export const BackgroundArrows = () => {
  return (
    <Box sx={arrowContainerStyles}>
      <div className={classes.wrapper} />
    </Box>
  );
};

const arrowContainerStyles = {
  position: 'absolute',
  top: '320px',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
  marginLeft: '-130px',
};
