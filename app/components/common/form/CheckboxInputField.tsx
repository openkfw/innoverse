import { Controller } from 'react-hook-form';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { FormInputProps } from '@/common/formTypes';

import { inputStyle } from './formStyle';

export const CheckboxInputField = ({ name, control, label, sx }: FormInputProps) => {
  const labelAria = { inputProps: { 'aria-label': label } };

  const checkboxStyle = {
    color: 'primary.main',
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <FormControlLabel
          label={label}
          sx={{ ...sx }}
          control={
            <Checkbox {...labelAria} checked={value} onChange={onChange} sx={{ ...inputStyle, ...checkboxStyle }} />
          }
        />
      )}
    />
  );
};
