import { Controller } from 'react-hook-form';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { FormInputProps } from '@/common/formTypes';

import { inputStyle } from './formStyle';

export const CheckboxInputField = ({ name, control, label, sx }: FormInputProps) => {
  const labelAria = { inputProps: { 'aria-label': label } };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <FormControlLabel
          label={label}
          sx={{
            ...inputStyle,
            ...sx,
            ...labelStyle,
          }}
          control={<Checkbox {...labelAria} checked={value} onChange={onChange} sx={{ ...inputStyle, ...iconStyle }} />}
        />
      )}
    />
  );
};

const labelStyle = {
  '& .MuiTypography-root': {
    color: 'common.black',
    fontSize: '16px',
  },
};

const iconStyle = {
  color: 'common.black',
  '& .MuiSvgIcon-root': { fontSize: 20 },
};
