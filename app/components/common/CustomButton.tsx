import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Button, { ButtonProps } from '@mui/material/Button';
import { SxProps } from '@mui/material/styles';

type CustomButtonProps = ButtonProps & {
  themeVariant?: 'primary' | 'secondary';
};

export default function CustomButton({ themeVariant = 'primary', sx, ...props }: CustomButtonProps) {
  const style = themeVariant === 'primary' ? buttonStylePrimary : buttonStyleSecondary;
  return (
    <Button
      variant="outlined"
      endIcon={<ArrowForwardIcon fontSize="small" />}
      sx={[style, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    >
      {props.children}
    </Button>
  );
}

const buttonStylePrimary: SxProps = {
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
};

const buttonStyleSecondary: SxProps = {
  color: 'rgba(0, 0, 0, 0.56)',
  fontFamily: 'Arial',
  fontSize: '13px',
  fontWeight: '700',
  lineHeight: '19px',
  border: '1px solid',
  borderColor: 'rgba(0, 0, 0, 0.10)',
  background: 'rgba(255, 255, 255, 0.10)',
  minWidth: 0,
  height: '35px',
  px: 1,
  py: 1,
  '&:hover': {
    border: '1px solid rgba(255, 255, 255, 0.40)',
    background: 'secondary.main',
  },
  '&:active': {
    border: '1px solid rgba(255, 255, 255, 0.40)',
    background: 'secondary.main',
  },
};
