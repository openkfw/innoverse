// @ts-nocheck

import palette from "./palette";
import ***FONT_REMOVED***";
import ***FONT_REMOVED***";
import ***FONT_REMOVED***";

import { Components, Theme } from "@mui/material/styles";

const components: Components<Omit<Theme, "components">> = {
  MuiCssBaseline: {
    styleOverrides: `
      @font-face {
        font-family: '***FONT_REMOVED***';
        src: local('***FONT_REMOVED***'), url(${***FONT_REMOVED***}) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }

      @font-face {
        font-family: '***FONT_REMOVED***';
        src: local('***FONT_REMOVED***'), url(${***FONT_REMOVED***}) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }

      @font-face {
        font-family: '***FONT_REMOVED***';
        src: local('***FONT_REMOVED***'), url(${***FONT_REMOVED***}) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }
    `,
  },
  MuiLink: {
    styleOverrides: {
      root: {
        color: palette.primary?.main,
        "&:hover": {
          color: palette.primary?.light,
        },
        "&:active": {
          color: palette.secondary?.main,
        },
      },
    },
  },
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        link: "p",
        h1_primary_contrast: "h1",
        h2_primary_light: "h2",
        h2_secondary_main: "h2",
        h3_primary_contrast: "h3",
        body1_primary_contrast: "p",
        body2_primary_contrast: "p",
      },
    },
  },
};

export default components;
