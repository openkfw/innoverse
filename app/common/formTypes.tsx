export interface FormInputProps {
  name: string;
  control: any;
  label: string;
  setValue?: any;
  options?: Option[];
  readOnly?: boolean;
  placeholder?: string;
  disableFuture?: boolean;
}

export type Option = {
  label: string;
  value: string;
};
