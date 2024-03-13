import React from 'react';
import { Controller } from 'react-hook-form';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { FormInputProps, Option } from '@/common/formTypes';

import { inputStyle } from './formStyle';

type DropdownFieldProps = FormInputProps & { startAdornment: React.ReactNode };

export const DropdownField = ({
  name,
  control,
  label,
  options,
  readOnly = false,
  startAdornment,
  sx,
}: DropdownFieldProps) => {
  const generateSingleOptions = () => {
    return options?.map((option: Option) => {
      return (
        <MenuItem key={option.value} value={option.value} sx={{ color: 'text.primary' }}>
          {option.label}
        </MenuItem>
      );
    });
  };

  return (
    <FormControl size="medium" sx={sx}>
      <InputLabel id="select-label">{label}</InputLabel>
      <Controller
        render={({ field, fieldState: { error } }) => (
          <>
            <Select
              {...field}
              labelId="select-label"
              label={label}
              readOnly={readOnly}
              error={!!error}
              startAdornment={startAdornment}
              sx={{ ...inputStyle, ...sx }}
            >
              {generateSingleOptions()}
            </Select>
            <FormHelperText>{error?.message}</FormHelperText>
          </>
        )}
        control={control}
        name={name}
      />
    </FormControl>
  );
};
