import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { CustomIconButton } from '@/components/common/CustomIconButton';
import * as m from '@/src/paraglide/messages.js';

interface VoteResultCardProps {
  handleVote: (vote: string) => Promise<void>;
  selectedOption: string | undefined;
  votesPerOption: { option: string; votes: number; percentage: number }[];
}

export const VoteResultCard = ({ handleVote, selectedOption, votesPerOption }: VoteResultCardProps) => {
  const totalVotes = votesPerOption.reduce((total, entry) => total + entry.votes, 0);

  return (
    <Box sx={votesCardStyle} display={'flex'}>
      {!!selectedOption ? (
        <>
          <Typography variant="subtitle1" color="primary.main" sx={{ pb: '1px', fontWeight: '500' }}>
            {`${totalVotes} Abstimmungen`}
          </Typography>
          <CustomIconButton
            onClick={() => handleVote(selectedOption)}
            startIcon={<RemoveCircleOutlineIcon />}
            sx={removeVoteStyle}
            textSx={removeVoteTypographyStyle}
          >
            {m.components_collaboration_survey_voteResultCard_deleteVote()}
          </CustomIconButton>
        </>
      ) : (
        <Typography variant="caption" color="primary.main">
          {m.components_collaboration_survey_voteResultCard_showResults()}
        </Typography>
      )}
    </Box>
  );
};

const votesCardStyle: SxProps = {
  width: '172px',
  padding: 'var(--2, 16px)',
  paddingRight: '0px',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: 'var(--1, 8px)',
  flexShrink: 0,
  height: 120,
  borderRadius: 'var(--1, 8px)',
  background: 'rgba(0, 90, 140, 0.10)',
  '@media (max-width: 1360px)': {
    width: '360px',
    maxWidth: '100%',
    marginLeft: 0,
  },
};

const removeVoteStyle: SxProps = {
  border: 'none',
  p: 1,
  ml: -1,
  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.10)', border: 'none' },
  '&:active': 'none',
  '& .MuiButton-startIcon': {
    mr: 0.5,
    color: '#266446',
  },
};

const removeVoteTypographyStyle: SxProps = {
  fontSize: '12px',
  color: '#266446',
  fontWeight: '400',
};
