import React from 'react';
import { Controller } from 'react-hook-form';

import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { FormInputProps, Option } from '@/common/formTypes';
import * as m from '@/src/paraglide/messages.js';

import { formLabelStyle, inputLabelStyle } from './formStyle';

type DropdownFieldProps = FormInputProps & { startAdornment: React.ReactNode };

export const AutocompleteDropdownField = ({
  name,
  control,
  label,
  options,
  secondary,
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
              onChange={(_, value) => field.onChange(value)}
              isOptionEqualToValue={(option, value) => option.id === value.id || value.id === ''}
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
                  sx={inputLabelStyle(secondary)}
                  helperText={m.components_common_form_autoCompleteDropdownField_helpText()}
                  FormHelperTextProps={{ sx: helperTextStyles }}
                  error={!!error}
                  InputProps={{ ...params.InputProps, startAdornment }}
                />
              )}
              noOptionsText={m.components_common_form_autoCompleteDropdownField_noOptionText()}
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

// Autocomplete Dropdown Field Styles
const helperTextStyles = {
  color: 'var(--text-primary, #2D3134)',
};
