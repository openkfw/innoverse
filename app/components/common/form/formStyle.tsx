'use client';

import { SxProps } from '@mui/material/styles';

const textColor = (secondary?: boolean) => (secondary ? 'common.white' : 'common.black');

export const formLabelStyle = {
  color: 'common.black',
  fontFamily: 'SansDefaultMed',
  fontSize: '14px',
  '&.Mui-focused': {
    color: 'common.black',
  },
};

export const inputLabelStyle = (secondary?: boolean) => ({
  '& .MuiInputLabel-root': {
    color: textColor(secondary),
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: secondary ? 'common.white' : 'primary.main',
  },
});

export const inputStyle = (secondary?: boolean) => {
  return {
    '& .MuiFormLabel-root': {
      color: textColor(secondary),
      fontFamily: 'SansDefaultMed',
      fontSize: '14px',
      '&.Mui-focused': {
        color: textColor(secondary),
      },
    },
    '&.Mui-focused': {
      color: textColor(secondary),
    },
    '& + .MuiAutocomplete-popper .MuiAutocomplete-option': {
      color: textColor(secondary),
      fontFamily: 'SansDefaultMed',
      fontSize: '14px',
      '&.Mui-focused': {
        color: textColor(secondary),
      },
    },
    '& + .MuiTypography-root': {
      color: textColor(secondary),
      fontFamily: '***FONT_REMOVED***',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: textColor(secondary),
      },
      '&:hover fieldset': {
        borderColor: textColor(secondary),
      },
      '&.Mui-focused fieldset': {
        color: textColor(secondary),
        border: '2px solid',
        borderColor: textColor(secondary),
      },
      '& input': {
        color: textColor(secondary),
      },
    },
  } as SxProps;
};
