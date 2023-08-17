// @ts-nocheck

import palette from "./palette";
import ***FONT_REMOVED***";
import ***FONT_REMOVED***";
import ***FONT_REMOVED***";

import ***FONT_REMOVED***";
import ***FONT_REMOVED***";
import ***FONT_REMOVED***";

import PFCentroSansProReg from "../assets/fonts/PFCentroSansPro-Reg.woff2";
import PFCentroSansProMed from "../assets/fonts/PFCentroSansPro-Med.woff2";
import PFCentroSansProBold from "../assets/fonts/PFCentroSansPro-Bold.woff2";

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

      @font-face {
        font-family: 'PFCentroSansProReg';
        src: local('PFCentroSansProReg'), url(${PFCentroSansProReg}) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }

      @font-face {
        font-family: 'PFCentroSansProMed';
        src: local('PFCentroSansProMed'), url(${PFCentroSansProMed}) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }

      @font-face {
        font-family: 'PFCentroSansProBold';
        src: local('PFCentroSansProBold'), url(${PFCentroSansProBold}) format('woff2');
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
  MuiButton: {
    styleOverrides: {
      root: {
        color: palette.common?.white,
        backgroundColor: palette.primary?.light,
        borderRadius: 48,
        backdropFilter: "blur(24px)",
        "&:hover": {
          color: palette.common?.white,
          backgroundColor: palette.secondary?.main,
          borderColor: palette.common?.white,
        },
        "&:active": {
          color: palette.common?.white,
          backgroundColor: palette.secondary?.main,
          borderColor: palette.common?.white,
        },
      },
      outlined: {
        borderColor: palette.common?.white,
      },
    },
  },
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        link: "p",
      },
    },
  },
};

export default components;
