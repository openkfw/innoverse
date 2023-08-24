import { PaletteOptions, SimplePaletteColorOptions } from '@mui/material';

interface DefaultPaletteOptions extends PaletteOptions {
  primary?: SimplePaletteColorOptions;
  secondary?: SimplePaletteColorOptions;
}

const palette: DefaultPaletteOptions = {
  primary: {
    main: '#0067A0',
    dark: '#004267',
    light: '#005A8C',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#A4B419',
    light: '#879900',
    dark: '#5E7200',
    contrastText: '#0000008F',
  },
  text: {
    primary: '#000000DE',
    secondary: '#FFFFFF',
    disabled: '#BDC0C2',
  },
  common: {
    white: '#FFFFFF',
  },
  action: {
    active: '#0000008F',
    disabledBackground: '#F5F5F5',
  },
  background: {
    default: '#0067A0',
    paper: '#FFFFFF',
  },
  error: {
    main: '#C80538',
    light: '#FDECEB',
  },
  warning: {
    main: '#BD900D',
    light: '#FEF5E6',
  },
  info: {
    main: '#005A8C',
    light: '#E9F5FE',
  },
  success: {
    main: '#507666',
    light: '#EDF7EE',
  },
};

export default palette;
