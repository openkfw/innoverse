import React from 'react';
import { Controller } from 'react-hook-form';

import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { FormInputProps, Option } from '@/common/formTypes';

import { formLabelStyle } from './formStyle';

type DropdownFieldProps = FormInputProps & { startAdornment: React.ReactNode };

export const AutocompleteDropdownField = ({
  name,
  control,
  label,
  options,
  readOnly = false,
  startAdornment,
  sx,
}: DropdownFieldProps) => {
  return (
    <FormControl size="medium" sx={sx}>
      <Controller
        render={({ field, fieldState: { error } }) => (
          <>
            <Autocomplete
              {...field}
              id="autocomplete-dropdown"
              getOptionLabel={(option) => option.label || ''}
              onChange={(_, value) => {
                field.onChange(value);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id || value.id == ''}
              options={options as readonly Option[]}
              renderOption={(props, option) => {
                return (
                  <Typography {...props} key={option.id} sx={formLabelStyle}>
                    {option.label}
                  </Typography>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label}
                  sx={{ color: 'text.primary' }}
                  error={!!error}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment,
                  }}
                />
              )}
              noOptionsText="Keine Optionen"
              readOnly={readOnly}
              sx={sx}
            />

            <FormHelperText error>{error?.message}</FormHelperText>
          </>
        )}
        control={control}
        name={name}
      />
    </FormControl>
  );
};
