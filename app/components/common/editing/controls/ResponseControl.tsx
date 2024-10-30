import Button from '@mui/material/Button';

import ReplyIcon from '@/components/icons/ReplyIcon';

interface ResponseControlsProps {
  onResponse: () => void;
}

export const ResponseControls = ({ onResponse }: ResponseControlsProps) => {
  return (
    <Button onClick={onResponse} sx={iconButtonOnlyStyles}>
      <ReplyIcon color="black" />
    </Button>
  );
};

// Response Controls Styles
const iconButtonOnlyStyles = {
  width: '32px',
  height: '32px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '48px',
  border: '1px solid #D8DFE3',
  backgroundColor: 'transparent',
  minWidth: 'unset',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    border: '1px solid #D8DFE3',
  },
  '&:active': {
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
    border: '1px solid #D8DFE3',
  },
};
