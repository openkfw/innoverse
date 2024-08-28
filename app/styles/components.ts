// @ts-nocheck

import { Components, Theme } from '@mui/material/styles';

import palette from './palette';

const components: Components<Omit<Theme, 'components'>> = {
  MuiCssBaseline: {
    styleOverrides: `
      html {
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }


      @font-face {
        font-family: 'SansDefaultReg';
        font-display: optional;
        src: local('SansDefaultReg'), url(/fonts/Sans-Default-Reg.woff2) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }

      @font-face {
        font-family: 'SansDefaultMed';
        font-display: optional;
        src: local('SansDefaultMed'), url(/fonts/Sans-Default-Med.woff2) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }

      @font-face {
        font-family: 'SansDefaultBold';
        font-display: optional;
        src: local('SansDefaultBold'), url(/fonts/Sans-Default-Bold.woff2) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }

      @font-face {
        font-family: 'SlabReg';
        font-display: optional;
        src: local('SlabReg'), url(/fonts/Slab-Reg.woff2) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }

      @font-face {
        font-family: 'SlabMed';
        font-display: optional;
        src: local('SlabMed'), url(/fonts/Slab-Med.woff2) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }

      @font-face {
        font-family: 'SlabBold';
        font-display: optional;
        src: local('SlabBold'), url(/fonts/Slab-Bold.woff2) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }

      @font-face {
        font-family: 'SansHeadingsReg';
        font-display: optional;
        src: local('Sans-Headings-Reg'), url(/fonts/Sans-Headings-Reg.woff2) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }

      @font-face {
        font-family: 'SansHeadingsMed';
        font-display: optional;
        src: local('Sans-Headings-Med'), url(/fonts/Sans-Headings-Med.woff2) format('woff2');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }

      @font-face {
        font-family: 'SansHeadingsBold';
        font-display: optional;
        src: local('Sans-Headings-Bold'), url(/fonts/Sans-Headings-Bold.woff2) format('woff2');
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
          color: palette.secondary?.main,
        },
      },
    },
  },
  MuiRadio: {
    styleOverrides: {
      root: {
        color: palette.common?.white,
        '&.Mui-checked': {
          color: palette.secondary?.main,
        },
      },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: {
        color: palette.common?.white,
        fontFamily: 'SansDefaultMed',
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
        '@media (min-width: 900px)': {
          fontSize: '0.875rem',
        },
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
  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: palette.common?.black,
      },
      formControl: {
        color: palette.common?.black,
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        color: palette.common?.black,
      },
    },
  },
  MuiButtonBase: {
    styleOverrides: {
      root: {
        color: palette.text?.primary,
        MuiMenuItem: {
          styleOverrides: {
            root: { color: palette.text?.primary },
          },
        },
      },
    },
  },
  MuiPickersToolbar: {
    styleOverrides: {
      root: {
        backgroundColor: palette.primary?.light,
        '.MuiTypography-root': {
          color: palette.common?.white,
        },
      },
    },
  },
  MuiPickersCalendarHeader: {
    styleOverrides: {
      labelContainer: {
        color: palette.text?.primary,
      },
    },
  },
  MuiPickersYear: {
    styleOverrides: {
      yearButton: {
        color: palette.text?.primary,
      },
    },
  },
};

export default components;
