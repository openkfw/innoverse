import { useEffect, useState } from 'react';

import { SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import { useProject } from '@/app/contexts/project-context';
import { SurveyQuestion } from '@/common/types';
import theme from '@/styles/theme';

import { getUserVoted, handleSurveyVote } from './actions';

interface SurveyCardProps {
  projectId: string;
  surveyQuestion: SurveyQuestion;
}

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

export const SurveyCard = ({ projectId, surveyQuestion }: SurveyCardProps) => {
  const { question, responseOptions } = surveyQuestion;
  const [vote, setVote] = useState('');
  const { surveyVotesAmount } = useProject();
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(surveyVotesAmount);

  const { setSurveyVotesAmount } = useProject();

  const handleVote = async (_event: React.MouseEvent<HTMLElement>, newVote: string) => {
    try {
      await handleSurveyVote({ projectId, surveyQuestionId: surveyQuestion.id, vote: newVote });

      if (voted && vote === newVote) {
        setVotes((prev) => Math.max(0, prev - 1));
        setVote('');
        setVoted(false);
      } else {
        if (!voted) setVotes((prev) => prev + 1);
        setVote(newVote);
        setVoted(true);
      }
    } catch (error) {
      console.error('Failed to handle vote:', error);
      errorMessage({ message: 'Failed to submit your vote. Please try again.' });
    }
    setSurveyVotesAmount(votes);
  };

  useEffect(() => {
    const setSurveyVote = async () => {
      try {
        const { data: userVote } = await getUserVoted({ surveyQuestionId: surveyQuestion.id });
        if (userVote) {
          setVote(userVote.vote);
          setVoted(true);
        }
      } catch (error) {
        console.error('Failed to fetch user vote:', error);
        errorMessage({ message: 'Failed to load your voting status. Please try again.' });
      }
    };
    setSurveyVote();
    setSurveyVotesAmount(votes);
  }, [votes, setSurveyVotesAmount, surveyQuestion.id]);

  return (
    <Grid container item>
      <Grid container item xs={12} md={6} direction="column" sx={leftGridStyles}>
        <Grid item>
          <Typography variant="h5" color="secondary.contrastText">
            {question}
          </Typography>
        </Grid>
      </Grid>

      <Grid item xs={12} md={6} sx={rightGridStyles}>
        <Box
          sx={{
            alignItems: 'center',
            display: { md: 'block', lg: 'flex' },
          }}
        >
          <StyledToggleButtonGroup
            exclusive
            orientation="vertical"
            size="small"
            sx={toggleButonStyle}
            onChange={handleVote}
          >
            {responseOptions.map((response, key) => {
              return (
                <ToggleButton value={response.responseOption} key={key}>
                  <StyledChip
                    label={response.responseOption}
                    key={response.responseOption}
                    active={vote === response.responseOption ? 'true' : 'false'}
                  />
                </ToggleButton>
              );
            })}
          </StyledToggleButtonGroup>
          <Box sx={votesCardStyle}>
            <Typography variant="subtitle1" color="primary.main">
              {surveyVotesAmount} Votes
            </Typography>
            <Typography variant="caption" color="primary.main">
              Um die Ergebnisse zu sehen, bitte gib deine Stimme ab.
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

const leftGridStyles: SxProps = {
  paddingRight: '2em',
  [theme.breakpoints.down('md')]: {
    paddingRight: 0,
    paddingBottom: '2em',
  },
};

const rightGridStyles: SxProps = {
  paddingLeft: '2em',
  [theme.breakpoints.down('md')]: {
    paddingLeft: 0,
    flexDirection: 'column',
  },
};

const toggleButonStyle = {
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
