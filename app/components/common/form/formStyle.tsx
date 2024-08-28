export const formLabelStyle = {
  color: 'primary.main',
  fontFamily: 'SansDefaultMed',
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
    fontFamily: 'SansDefaultMed',
    fontSize: '14px',
    '&.Mui-focused': {
      color: 'primary.main',
    },
  },
  '& + .MuiTypography-root': {
    color: 'text.primary',
    fontFamily: '***FONT_REMOVED***',
  },
};
