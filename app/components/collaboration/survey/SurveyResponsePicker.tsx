import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { styled, SxProps } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import { ResponseOption } from '@/common/types';
import theme from '@/styles/theme';

interface SurveyResponsePickerProps {
  responseOptions: ResponseOption[];
  handleVote: (vote: string) => Promise<void>;
  selectedOption: string | undefined;
  voteCount: number;
  sx?: SxProps;
}

export const SurveyResponsePicker = ({
  responseOptions,
  handleVote,
  selectedOption,
  voteCount,
  sx,
}: SurveyResponsePickerProps) => {
  return (
    <Box sx={sx}>
      <StyledToggleButtonGroup
        exclusive
        orientation="vertical"
        size="small"
        sx={toggleButonStyle}
        onChange={(_, vote) => handleVote(vote)}
      >
        {responseOptions.map((response, idx) => (
          <ToggleButton key={idx} value={response.responseOption}>
            <StyledChip
              label={response.responseOption}
              key={response.responseOption}
              active={selectedOption === response.responseOption ? 'true' : 'false'}
            />
          </ToggleButton>
        ))}
      </StyledToggleButtonGroup>

      <Box sx={votesCardStyle}>
        <Typography variant="subtitle1" color="primary.main" sx={{ textAlign: 'center' }}>
          {voteCount} Votes
        </Typography>
      </Box>
    </Box>
  );
};

const StyledChip = styled(Chip)<{ active: string }>(({ active, theme }) => ({
  display: 'flex',
  width: '100%',
  height: 'auto',
  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'stretch',
  borderRadius: '100px',
  fontSize: '13px',
  color: active == 'true' ? theme.palette.common.white : theme.palette.common.black,
  background: active == 'true' ? theme.palette.primary.light : 'rgba(0, 0, 0, 0.08)',
  ':hover': {
    color: theme.palette.common.white,
    background: theme.palette.primary.light,
  },
}));

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
  width: '360px',
  maxWidth: '100%',
  paddingRight: '1em',
  paddingBottom: '1em',
  [theme.breakpoints.down('md')]: {
    paddingRight: 0,
  },
};

const votesCardStyle: SxProps = {
  width: '172px',
  maxWidth: '100%',
  padding: 'var(--2, 16px)',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: 'var(--1, 8px)',
  flexShrink: 0,
  borderRadius: 'var(--1, 8px)',
  background: 'rgba(0, 90, 140, 0.10)',
  [theme.breakpoints.down('md')]: {
    width: '360px',
    maxWidth: '100%',
    marginLeft: 0,
  },
};
