import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';

interface ResetBannerProps {
  onClick: () => void;
  updateCount: number;
}

export default function ResetBanner(props: ResetBannerProps) {
  const { onClick, updateCount } = props;

  return (
    <Card sx={cardStyles}>
      <Icon sx={iconStyles} onClick={onClick}>
        <RefreshOutlinedIcon />
      </Icon>
      <Typography variant="subtitle1">
        {updateCount} neue Updates verfügbar
        <Button sx={buttonStyles} onClick={onClick}>
          Jetzt zeigen
        </Button>
      </Typography>
    </Card>
  );
}

const cardStyles = {
  display: 'flex',
  padding: '24px 16px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  borderRadius: '16px',
  border: '1px solid rgba(183, 249, 170, 0.80)',
  backgroundColor: 'rgba(255, 255, 255, 0.20)',
  boxShadow: '0px 12px 40px 0px rgba(0, 0, 0, 0.25)',
  backdropFilter: 'blur(20px)',
  width: 761,
  height: 76,
};

const iconStyles = {
  color: 'white',
  width: '16',
  height: '16',
  cursor: 'pointer',
  '&:hover': {
    color: '#B7F9AA',
  },
};

const buttonStyles = {
  color: '#B7F9AA !important',
  textDecoration: 'underline !important',
  border: 'none',
  borderRadius: '0',
  backgroundColor: 'transparent !important',
  backdropFilter: 'none',
};
