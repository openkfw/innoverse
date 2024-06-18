import Box from '@mui/material/Box';
import { styled, SxProps } from '@mui/material/styles';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { ResponseOption } from '@/common/types';
import { SurveyVoteComponent } from '@/components/collaboration/survey/SurveyVoteComponent';
import theme from '@/styles/theme';

import { VoteResultCard } from './VoteResultCard';

interface SurveyResponsePickerProps {
  responseOptions: ResponseOption[];
  handleVote: (vote: string) => Promise<void>;
  selectedOption: string | undefined;
  votesPerOption: { option: string; votes: number; percentage: number }[];
  sx?: SxProps;
  fill?: boolean;
}

export const SurveyResponsePicker = ({
  responseOptions,
  handleVote,
  selectedOption,
  votesPerOption,
  sx,
  fill,
}: SurveyResponsePickerProps) => {
  const getFillPercentage = (response: ResponseOption) => {
    return (
      (selectedOption && votesPerOption.find((option) => option.option === response.responseOption)?.percentage) || 0
    );
  };

  return (
    <Box sx={sx}>
      <StyledToggleButtonGroup
        exclusive
        orientation="vertical"
        size="small"
        sx={{ ...toggleButonStyle, width: fill ? '1000px' : '360px' }}
        onChange={(_, vote) => handleVote(vote)}
      >
        {responseOptions.map((response, idx) => (
          <SurveyVoteComponent
            key={idx}
            response={response}
            selectedOption={selectedOption}
            fillPercentage={getFillPercentage(response)}
          />
        ))}
      </StyledToggleButtonGroup>

      <VoteResultCard handleVote={handleVote} selectedOption={selectedOption} votesPerOption={votesPerOption} />
    </Box>
  );
};

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      marginTop: 10,
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
    '&.MuiToggleButton-root': {
      padding: 0,
    },
    '&.Mui-selected': {
      color: theme.palette.common.white,
      background: theme.palette.primary.light,
    },
  },
}));

const toggleButonStyle: SxProps = {
  maxWidth: '100%',
  paddingRight: '1em',
  paddingBottom: '1em',
  [theme.breakpoints.down('md')]: {
    paddingRight: 0,
  },
};
