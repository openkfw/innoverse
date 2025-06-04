import { Controller } from 'react-hook-form';

import TextField from '@mui/material/TextField';

import { MultilineFormInputProps } from '@/common/formTypes';

import { inputLabelStyle } from './formStyle';

export const MultilineTextInputField = ({
  name,
  control,
  label,
  placeholder,
  readOnly = false,
  endAdornment,
  sx,
  inputPropsSx,
  rows = 4,
}: MultilineFormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          sx={{
            ...inputLabelStyle(),
            ...sx,
          }}
          InputLabelProps={{ shrink: true }}
          placeholder={placeholder}
          helperText={error ? error.message : null}
          multiline
          size="small"
          error={!!error}
          label={label}
          rows={rows}
          InputProps={{
            readOnly,
            endAdornment: endAdornment,
            style: inputPropsSx,
          }}
        />
      )}
    />
  );
};
