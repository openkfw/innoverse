'use client';

import { SxProps } from '@mui/material/styles';

export const formLabelStyle = {
  color: 'primary.main',
  fontFamily: 'SansDefaultMed',
  fontSize: '14px',
  '&.Mui-focused': {
    color: 'primary.main',
  },
};

export const inputStyle = (secondary?: boolean) => {
  return {
    '& .MuiFormLabel-root': {
      color: secondary ? 'common.white' : 'primary.main',
      fontFamily: 'SansDefaultMed',
      fontSize: '14px',
      '&.Mui-focused': {
        color: secondary ? 'common.white' : 'primary.main',
      },
    },
    '& + .MuiAutocomplete-popper .MuiAutocomplete-option': {
      color: !secondary && 'primary.main',
      fontFamily: 'SansDefaultMed',
      fontSize: '14px',
      '&.Mui-focused': {
        color: secondary ? 'common.white' : 'primary.main',
      },
    },
    '& + .MuiTypography-root': {
      color: secondary ? 'common.white' : 'primary.main',
      fontFamily: '***FONT_REMOVED***',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'common.white',
      },
      '&:hover fieldset': {
        borderColor: 'common.white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'action.hover',
      },
      '& input': {
        color: 'common.white',
      },
    },
  } as SxProps;
};
