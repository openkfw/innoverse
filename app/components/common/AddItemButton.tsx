import AddIcon from '@mui/icons-material/Add';
import { ButtonProps } from '@mui/material/Button';

import { TransparentButton } from '@/components/common/TransparentButton';

export const TransparentAddButton = ({ children, ...buttonProps }: ButtonProps) => {
  return (
    <TransparentButton
      startIcon={<AddIcon color="secondary" fontSize="large" />}
      style={{ marginTop: '1em', marginLeft: '1.5em', marginBottom: 2 }}
      {...buttonProps}
    >
      {children}
    </TransparentButton>
  );
};
