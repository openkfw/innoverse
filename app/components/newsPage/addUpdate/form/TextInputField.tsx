import { Controller } from 'react-hook-form';

import TextField from '@mui/material/TextField';

import { FormInputProps } from '@/common/formTypes';

import { inputStyle } from './AddUpdateForm';

export const TextInputField = ({ name, control, label, readOnly = false }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          sx={inputStyle}
          helperText={error ? error.message : null}
          size="small"
          error={!!error}
          label={label}
          InputProps={{
            readOnly,
          }}
        />
      )}
    />
  );
};
