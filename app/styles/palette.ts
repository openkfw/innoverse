import { PaletteOptions, SimplePaletteColorOptions } from '@mui/material/styles';

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
    contrastText: '#000',
  },
  text: {
    primary: '#5A6166',
    secondary: '#507666',
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
    main: '#C80439',
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
    main: '#4F7765',
    light: '#EDF7EE',
  },
};

export default palette;
