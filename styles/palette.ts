import { PaletteOptions, SimplePaletteColorOptions } from "@mui/material";

declare module "@mui/material/styles" {
  interface PaletteOptions {
    custom?: {
      textTertiary: string;
    };
  }
}

interface DefaultPaletteOptions extends PaletteOptions {
  primary?: SimplePaletteColorOptions;
  secondary?: SimplePaletteColorOptions;
}

const palette: DefaultPaletteOptions = {
  primary: {
    main: "#12556F",
    light: "#A1DCF8",
    dark: "#13556F",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#879900",
    light: "#A4B419",
    dark: "#5E7200",
    contrastText: "#ffffff",
  },
  text: {
    primary: "#879900",
    secondary: "#5A6166",
    disabled: "#BDC0C2",
  },
  custom: {
    textTertiary: "#005A8C",
  },
  action: {
    disabled: "#BDC0C2",
    disabledBackground: "#F5F5F5",
  },
  background: {
    default: "#faf9f8",
    paper: "#FFFFFF",
  },
  error: {
    main: "#C80538",
    light: "#FDECEB",
  },
  warning: {
    main: "#BD900D",
    light: "#FEF5E6",
  },
  info: {
    main: "#005A8C",
    light: "#E9F5FE",
  },
  success: {
    main: "#507666",
    light: "#EDF7EE",
  },
};

export default palette;
