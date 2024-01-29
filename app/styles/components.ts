// @ts-nocheck

import { Components, Theme } from '@mui/material/styles';

import palette from './palette';

const components: Components<Omit<Theme, 'components'>> = {
  MuiCssBaseline: {
    styleOverrides: `
      @font-face {
        font-family: '***FONT_REMOVED***';
        src: local('***FONT_REMOVED***) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }

      @font-face {
        font-family: '***FONT_REMOVED***';
        src: local('***FONT_REMOVED***) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }

      @font-face {
        font-family: '***FONT_REMOVED***';
        src: local('***FONT_REMOVED***) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }

      @font-face {
        font-family: '***FONT_REMOVED***';
        src: local('***FONT_REMOVED***) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }

      @font-face {
        font-family: '***FONT_REMOVED***';
        src: local('***FONT_REMOVED***) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }

      @font-face {
        font-family: '***FONT_REMOVED***';
        src: local('***FONT_REMOVED***) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }

      @font-face {
        font-family: 'PFCentroSansProReg';
        src: local('PFCentroSansProReg'), url(/fonts/PFCentroSansPro-Reg.woff2) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }

      @font-face {
        font-family: 'PFCentroSansProMed';
        src: local('PFCentroSansProMed'), url(/fonts/PFCentroSansPro-Med.woff2) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }

      @font-face {
        font-family: 'PFCentroSansProBold';
        src: local('PFCentroSansProBold'), url(/fonts/PFCentroSansPro-Bold.woff2) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }
    `,
  },
  MuiLink: {
    styleOverrides: {
      root: {
        color: palette.primary?.main,
        '&:hover': {
          color: palette.primary?.light,
        },
        '&:active': {
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
        backdropFilter: 'blur(24px)',
        '&:hover': {
          color: palette.common?.white,
          backgroundColor: palette.secondary?.main,
          borderColor: palette.common?.white,
        },
        '&:active': {
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
  MuiCheckbox: {
    styleOverrides: {
      root: {
        color: palette.common?.white,
        '&.Mui-checked': {
          color: palette.secondary.main,
        },
      },
    },
  },
  MuiRadio: {
    styleOverrides: {
      root: {
        color: palette.common?.white,
        '&.Mui-checked': {
          color: palette.secondary.main,
        },
      },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: {
        color: palette.common?.white,
        fontFamily: '***FONT_REMOVED***',
        fontSize: '14px',
        '&.Mui-focused': {
          color: palette.common?.white,
        },
      },
    },
  },
  MuiFormControlLabel: {
    styleOverrides: {
      label: {
        fontSize: '0.875rem',
      },
    },
  },
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        link: 'p',
      },
    },
  },
};

export default components;
