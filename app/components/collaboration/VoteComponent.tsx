import { useState } from 'react';

import ReplyIcon from '@mui/icons-material/Reply';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import theme from '@/styles/theme';

import ArrowDownIcon from '../icons/ArrowDownIcon';
import ArrowUpIcon from '../icons/ArrowUpIcon';

interface VoteComponentProps {
  upvotes: number;
  downvotes: number;
}

const VOTE_VALUE = {
  UP: 'up',
  DOWN: 'down',
};

export const VoteComponent = (props: VoteComponentProps) => {
  const { upvotes, downvotes } = props;
  const [value, setValue] = useState<string>('');
  const [upvoteValue, setUpvoteValue] = useState<number>(upvotes);
  const [downvoteValue, setDownvoteValue] = useState<number>(downvotes);

  const handleChange = (_event: React.MouseEvent<HTMLElement>, newValue: string) => {
    if (!value && newValue == VOTE_VALUE.UP) {
      setUpvoteValue(upvotes + 1);
    } else if (!newValue && value == VOTE_VALUE.UP) {
      setUpvoteValue(upvotes);
    } else if (!value && newValue == VOTE_VALUE.DOWN) {
      setDownvoteValue(downvotes + 1);
    } else if (!newValue && value == VOTE_VALUE.DOWN) {
      setDownvoteValue(downvotes);
    } else if (value == VOTE_VALUE.DOWN && newValue == VOTE_VALUE.UP) {
      setDownvoteValue(downvotes);
      setUpvoteValue(upvotes + 1);
    } else if (value == VOTE_VALUE.UP && newValue == VOTE_VALUE.DOWN) {
      setUpvoteValue(upvotes);
      setDownvoteValue(downvotes + 1);
    }
    setValue(newValue);
  };

  const buttonStyle = {
    color: 'rgba(0, 0, 0, 0.56)',
    borderRadius: '48px',
    fontSize: '13px',
    fontWeight: '700',
    lineHeight: '19px',
    background: 'rgba(255, 255, 255, 0.10)',
  };

  return (
    <Stack direction="row" sx={{ pt: 2 }}>
      <ToggleButtonGroup value={value} exclusive onChange={handleChange} aria-label="vote">
        <ToggleButton value={VOTE_VALUE.UP} sx={buttonStyle}>
          <ArrowUpIcon color={value == VOTE_VALUE.UP ? theme.palette.success.main : 'black'} /> {upvoteValue}
        </ToggleButton>
        <ToggleButton value={VOTE_VALUE.DOWN} sx={buttonStyle}>
          <ArrowDownIcon color={value == VOTE_VALUE.DOWN ? theme.palette.error.main : 'black'} /> {downvoteValue}
        </ToggleButton>
      </ToggleButtonGroup>
      <Button variant="outlined" startIcon={<ReplyIcon sx={{ color: 'black', opacity: '0.38' }} />} sx={buttonStyle}>
        <Typography variant="subtitle2" color="text.primary" sx={{ fontSize: 13, fontWeight: 700, opacity: 0.56 }}>
          antworten
        </Typography>
      </Button>
    </Stack>
  );
};
