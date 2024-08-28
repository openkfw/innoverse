import palette from './palette';

const baseStyles = {
  typography: {
    fontFeatureSettings: "'clig' off, 'liga' off",
  },
  header: {
    h1: {
      fontFamily: 'SansHeadingsBold',
      fontSize: '60px',
      fontStyle: 'normal',
      fontWeight: '1000',
      lineHeight: '120%',
      letterSpacing: '-0.5px',
    },
    h2: {
      fontFamily: 'SansHeadingsBold',
      fontSize: '55px',
      fontStyle: 'normal',
      fontWeight: '1000',
      lineHeight: '120%',
      letterSpacing: '-0.5px',
    },
    h3: {
      fontFamily: 'SlabMed',
      fontSize: '60px',
      fontStyle: 'normal',
      fontWeight: '1000',
      lineHeight: '120%',
      letterSpacing: '-0.5px',
    },
  },
  body: {
    body1: {
      fontFamily: 'SlabReg',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: '150%',
      letterSpacing: '0.15px',
    },
    body2: {
      fontFamily: 'SansDefaultMed',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: '150%',
      letterSpacing: '0.15px',
    },
  },
};

const header = {
  h1: {
    color: palette.common?.white,
    ...baseStyles.header.h1,
  },
  h2: {
    color: palette.common?.white,
    ...baseStyles.header.h2,
  },
  h3: {
    color: palette.common?.white,
    ...baseStyles.header.h3,
  },
  h4: {
    color: palette.common?.white,
    fontFamily: 'SansHeadingsBold',
    fontSize: '34px',
    fontStyle: 'normal',
    fontWeight: 1000,
    lineHeight: '123.5%',
    letterSpacing: '0.25px',
  },
  h5: {
    color: palette.secondary?.main,
    fontFamily: 'SansHeadingsBold',
    fontSize: '24px',
    fontWeight: 1000,
    lineHeight: '133.4%',
  },
  h6: {
    color: palette.common?.white,
    fontFamily: 'SansHeadingsBold',
    fontSize: '20px',
    fontStyle: 'normal',
    fontWeight: '1000',
    lineHeight: '160%',
    letterSpacing: '0.15px',
  },
};

const body = {
  body1: {
    color: palette.common?.white,
    ...baseStyles.body.body1,
  },
  body2: {
    color: palette.common?.white,
    ...baseStyles.body.body2,
  },
  link: {
    color: palette.common?.white,
    fontFamily: 'SansDefaultMed',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '150%',
    letterSpacing: '0.15px',
  },
  caption: {
    color: palette.text?.primary,
    fontFamily: 'SansDefaultMed',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '166%',
    letterSpacing: '0.4px',
  },
  overline: {
    color: palette.common?.white,
    fontFamily: 'SansDefaultMed',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '266%',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
  },
  subtitle1: {
    color: palette.common?.white,
    fontFamily: 'SansDefaultMed',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '175%',
    letterSpacing: '0.15px',
  },
  subtitle2: {
    color: palette.secondary?.main,
    fontFamily: 'SansDefaultMed',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: '175%',
    letterSpacing: '0.15px',
  },
  button: {
    fontFamily: 'SansDefaultMed',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: '500',
    textTransform: 'none' as const,
  },
};

const typography = {
  fontSize: 16,
  htmlFontSize: 16,
  color: palette.text?.primary,
  fontFamily: ['SansDefaultMed', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
  ...header,
  ...body,
};

export default typography;
