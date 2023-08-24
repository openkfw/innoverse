import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Button, { ButtonProps } from '@mui/material/Button';

export default function CustomButton(props: ButtonProps) {
  return (
    <Button
      variant="outlined"
      endIcon={<ArrowForwardIcon fontSize="small" />}
      sx={{
        color: 'common.white',
        borderRadius: '50px',
        border: '2px solid rgba(255, 255, 255, 0.40)',
        background: 'rgba(255, 255, 255, 0.10)',
        boxShadow: '0px 12px 32px 0px rgba(0, 0, 0, 0.25), 0px 4px 8px 0px rgba(0, 0, 0, 0.10)',
        backdropFilter: 'blur(24px)',
        '&:hover': {
          border: '2px solid rgba(255, 255, 255, 0.40)',
          background: 'secondary.main',
        },
        '&:active': {
          border: '2px solid rgba(255, 255, 255, 0.40)',
          background: 'palette.secondary.main',
        },
      }}
    >
      {props.children}
    </Button>
  );
}
