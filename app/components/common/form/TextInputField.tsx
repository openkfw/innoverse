import { Controller } from 'react-hook-form';

import TextField from '@mui/material/TextField';

import { FormInputProps } from '@/common/formTypes';
import { mergeStyles } from '@/utils/helpers';

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
  const style = secondary ? inputStyle(secondary) : inputStyle();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          sx={mergeStyles(style, sx)}
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
