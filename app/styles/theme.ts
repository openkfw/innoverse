'use client';
import { createTheme } from '@mui/material/styles';

import components from './components';
import palette from './palette';
import typography from './typography';

// Create a theme instance.
const theme = createTheme({
  palette,
  components,
  typography,
});

export default theme;
