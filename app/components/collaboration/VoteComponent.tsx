import { useState } from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import ArrowUpIcon from '../icons/ArrowUpIcon';
import ReplyIcon from '../icons/ReplyIcon';

interface VoteComponentProps {
  upvotes?: number;
}

const VOTE_VALUE = {
  UP: 'up',
  DOWN: ' down',
};

export const VoteComponent = (props: VoteComponentProps) => {
  const { upvotes = 0 } = props;
  const [value, setValue] = useState<string>('');
  const [upvoteValue, setUpvoteValue] = useState<number>(upvotes);

  const handleChange = (_event: React.MouseEvent<HTMLElement>, newValue: string) => {
    if (!value && newValue == VOTE_VALUE.UP) {
      setUpvoteValue(upvotes + 1);
    } else if (!newValue && value == VOTE_VALUE.UP) {
      setUpvoteValue(upvotes);
    } else if (value == VOTE_VALUE.DOWN && newValue == VOTE_VALUE.UP) {
      setUpvoteValue(upvotes + 1);
    } else if (value == VOTE_VALUE.UP && newValue == VOTE_VALUE.DOWN) {
      setUpvoteValue(upvotes);
    }
    setValue(newValue);
  };

  return (
    <Stack direction="row" spacing={1}>
      <ToggleButtonGroup value={value} exclusive onChange={handleChange} aria-label="vote">
        <ToggleButton value={VOTE_VALUE.UP} sx={buttonStyle}>
          <ArrowUpIcon color={value == VOTE_VALUE.UP ? 'green' : 'black'} /> {upvoteValue}
        </ToggleButton>
      </ToggleButtonGroup>

      <Button variant="outlined" startIcon={<ReplyIcon/>} sx={buttonStyle}>
        <Typography color="text.primary" sx={typographyStyles}>
          antworten
        </Typography>
      </Button>
    </Stack>
  );
};

// Vote Component Styles

const buttonStyle = {
  color: 'rgba(0, 0, 0, 0.56)',
  borderRadius: '48px',
  fontSize: '13px',
  fontWeight: '700',
  lineHeight: '19px',
  background: 'rgba(255, 255, 255, 0.10)',
  height: '32px',
  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.10)' },
};

const typographyStyles = {
  color: 'rgba(0, 0, 0, 0.56)',
  fontSize: 13,
  fontWeight: 700,
};
