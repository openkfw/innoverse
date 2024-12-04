import CheckIcon from '@mui/icons-material/Check';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import * as m from '@/src/paraglide/messages.js';

export const APPLY_BUTTON = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
};

interface ApplyFilterButtonProps {
  onClick: () => void;
  applyButtonType: string;
}

export default function ApplyFilterButton(props: ApplyFilterButtonProps) {
  const { onClick, applyButtonType } = props;
  const disabled = applyButtonType === APPLY_BUTTON.DISABLED;

  return (
    <Button
      sx={buttonStyle}
      endIcon={<CheckIcon sx={{ color: disabled ? 'text.primary' : undefined }} />}
      onClick={onClick}
      disabled={disabled}
    >
      <Typography variant="subtitle1" sx={typographyStyle}>
        {m.components_newsPage_newsFilter_applyFilterButton_apply()}
      </Typography>
    </Button>
  );
}

const buttonStyle = {
  position: 'absolute',
  bottom: '5%',
  alignSelf: 'center',
  px: 3,
  py: 1,
  borderRadius: '50px',
  border: '2px solid rgba(255, 255, 255, 0.40)',
  boxShadow: '0px 12px 32px 0px rgba(0, 0, 0, 0.25), 0px 4px 8px 0px rgba(0, 0, 0, 0.10)',
  backdropFilter: 'blur(24px)',
  backgroundColor: 'secondary.main',
  '&:disabled': {
    backgroundColor: 'rgba(0, 0, 0, 0.20)',
    color: 'common.white',
  },
};

const typographyStyle = {
  fontSize: '20px',
  color: 'text.primary',
};
