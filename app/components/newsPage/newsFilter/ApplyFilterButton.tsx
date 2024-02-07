import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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

  return (
    <Box>
      {applyButtonType == APPLY_BUTTON.DISABLED ? (
        <Button
          sx={{
            ...buttonStyle,
            ...disabledButtonStyle,
          }}
          endIcon={<CheckIcon />}
          onClick={onClick}
          disabled
        >
          <Typography variant="subtitle1" sx={typographyStyle}>
            Apply selection
          </Typography>
        </Button>
      ) : (
        <Button
          sx={{
            backgroundColor: 'secondary.main',
            ...buttonStyle,
          }}
          endIcon={<CheckIcon />}
          onClick={onClick}
        >
          <Typography variant="subtitle1" sx={typographyStyle}>
            Apply selection
          </Typography>
        </Button>
      )}
    </Box>
  );
}

const buttonStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '25%',
  px: 3,
  py: 1,
  borderRadius: '50px',
  border: '2px solid rgba(255, 255, 255, 0.40)',
  boxShadow: '0px 12px 32px 0px rgba(0, 0, 0, 0.25), 0px 4px 8px 0px rgba(0, 0, 0, 0.10)',
  backdropFilter: 'blur(24px)',
};

const typographyStyle = {
  fontSize: '20px',
};

const disabledButtonStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.20)',
  '&:disabled': { color: 'common.white' },
};
