import { Controller } from 'react-hook-form';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { FormInputProps, Option } from '@/common/formTypes';

import { inputStyle } from './AddUpdateForm';

export const DropdownField: React.FC<FormInputProps> = ({ name, control, label, options, readOnly = false }) => {
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
    <FormControl size="small" sx={inputStyle}>
      <InputLabel id="select-label">{label}</InputLabel>
      <Controller
        render={({ field, fieldState: { error } }) => (
          <>
            <Select {...field} labelId="select-label" label={label} readOnly={readOnly} error={!!error}>
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
