import Button from '@mui/material/Button';
import { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

interface SecondaryIconButtonProps {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
  sx?: SxProps<Theme>;
}

export default function SecondaryIconButton(props: SecondaryIconButtonProps) {
  const { label, onClick, icon, sx } = props;
  return (
    <Button sx={{ ...buttonStyle, ...sx }} startIcon={icon} onClick={onClick}>
      <Typography variant="subtitle2" color="secondary.main" sx={typographyStyle}>
        {label}
      </Typography>
    </Button>
  );
}

const buttonStyle = {
  backgroundColor: 'transparent',
  backdropFilter: 'none',
  ':hover': {
    backgroundColor: 'transparent',
  },
};

const typographyStyle = {
  fontSize: '14px',
};
