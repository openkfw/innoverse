import { SxProps } from '@mui/material/styles';

export interface FormInputProps {
  name: string;
  control: any;
  label?: string;
  setValue?: any;
  options?: Option[];
  readOnly?: boolean;
  placeholder?: string;
  disableFuture?: boolean;
  endAdornment?: JSX.Element;
  sx?: SxProps;
}

export interface MultilineFormInputProps extends FormInputProps {
  rows?: number;
}

export type Option = {
  id: string;
  label: string;
};
