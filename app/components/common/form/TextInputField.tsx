import { Controller } from 'react-hook-form';

import TextField from '@mui/material/TextField';

import { FormInputProps } from '@/common/formTypes';

import { inputStyle } from './formStyle';

export const TextInputField = ({
  name,
  control,
  label,
  readOnly = false,
  disabled = false,
  sx,
  secondary = false,
}: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          sx={{ ...(inputStyle(secondary) as any), ...sx }}
          helperText={error ? error.message : null}
          size="small"
          error={!!error}
          label={label}
          InputProps={{
            readOnly: readOnly,
          }}
          disabled={disabled}
          fullWidth
        />
      )}
    />
  );
};
