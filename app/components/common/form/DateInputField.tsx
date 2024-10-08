import { Controller } from 'react-hook-form';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { FormInputProps } from '@/common/formTypes';

import { inputStyle } from './formStyle';

export const DateInputField = ({
  name,
  control,
  label,
  readOnly = false,
  disableFuture = false,
  sx,
}: FormInputProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            {...field}
            label={label}
            sx={{ ...inputStyle, ...sx }}
            readOnly={readOnly}
            disableFuture={disableFuture}
            slotProps={{
              textField: {
                error: !!error,
                helperText: error?.message,
              },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};
