export const formLabelStyle = {
  color: 'primary.main',
  fontFamily: '***FONT_REMOVED***',
  fontSize: '14px',
  '&.Mui-focused': {
    color: 'primary.main',
  },
};

export const inputStyle = {
  '& .MuiFormLabel-root': {
    ...formLabelStyle,
  },
  '& + .MuiAutocomplete-popper .MuiAutocomplete-option': {
    color: 'primary.main',
    fontFamily: '***FONT_REMOVED***',
    fontSize: '14px',
    '&.Mui-focused': {
      color: 'primary.main',
    },
  },
};
