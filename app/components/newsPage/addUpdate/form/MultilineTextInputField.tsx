import { Controller } from 'react-hook-form';

import TextField from '@mui/material/TextField';

import { FormInputProps } from '@/common/formTypes';

import { inputStyle } from './AddUpdateForm';

export const MultilineTextInputField = ({ name, control, label, placeholder, readOnly = false }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          sx={inputStyle}
          InputLabelProps={{ shrink: true }}
          placeholder={placeholder}
          helperText={error ? error.message : null}
          multiline
          size="small"
          error={!!error}
          label={label}
          rows={4}
          InputProps={{
            readOnly,
          }}
        />
      )}
    />
  );
};
