import { PaletteOptions, SimplePaletteColorOptions } from '@mui/material/styles';

interface DefaultPaletteOptions extends PaletteOptions {
  primary?: SimplePaletteColorOptions;
  secondary?: SimplePaletteColorOptions;
  statistics?: SimplePaletteColorOptions;
  formText?: SimplePaletteColorOptions;
}

const palette: DefaultPaletteOptions = {
  primary: {
    main: '#266446',
    dark: '#004267',
    light: '#005A8C',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#57D96D',
    light: '#879900',
    dark: '#5E7200',
    contrastText: '#000',
  },
  text: {
    primary: '#2D3134',
    secondary: '#507666',
    disabled: '#BDC0C2',
  },
  common: {
    white: '#FFFFFF',
  },
  action: {
    active: '#0000008F',
    disabledBackground: '#F5F5F5',
    hover: '#B7F9AA',
    disabled: '#C3C2BF',
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
  statistics: {
    main: '#B7F9AA',
    light: '#ECFDED',
    dark: '#EBEBEB',
  },
  formText: {
    main: '#B7F9AA',
  },
};

export default palette;
