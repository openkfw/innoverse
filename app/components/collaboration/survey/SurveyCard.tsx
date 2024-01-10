import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import { useProject } from '@/app/contexts/project-context';
import { SurveyQuestion } from '@/common/types';

import { getUserVoted, handleSurveyVote } from './actions';

interface SurveyCardProps {
  projectId: string;
  surveyQuestion: SurveyQuestion;
}

const StyledChip = styled(Chip)<{ active: string }>(({ active, theme }) => ({
  display: 'flex',
  width: '320px',
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
    await handleSurveyVote({ projectId, surveyQuestionId: surveyQuestion.id, vote: newVote });

    // If the user already voted and the vote is same, untoggle the vote
    if (voted && vote === newVote) {
      setVotes(votes - 1);
      setSurveyVotesAmount(votes);
      setVote('');
      setVoted(false);
      return;
    }
    if (voted) {
      setVotes(votes);
      setSurveyVotesAmount(votes);
      setVote(newVote);
      setVoted(true);
      return;
    }
    setVotes(votes + 1);
    setSurveyVotesAmount(votes);
    setVote(newVote);
    setVoted(true);
  };

  useEffect(() => {
    const setSurveyVote = async () => {
      const { data: userVote } = await getUserVoted({ surveyQuestionId: surveyQuestion.id });
      if (userVote) {
        setVote(userVote.vote);
        setVoted(true);
      }
    };
    setSurveyVote();
    setSurveyVotesAmount(votes);
  }, [votes, setSurveyVotesAmount, surveyQuestion.id]);

  return (
    <Grid container item spacing={5} xs={12}>
      <Grid
        container
        item
        xs={6}
        direction="column"
        spacing={2}
        sx={{ paddingRight: '100px', alignSelf: 'flex-start' }}
      >
        <Grid item>
          <Typography variant="h5" color="secondary.contrastText">
            {question}
          </Typography>
        </Grid>
      </Grid>

      <Grid container direction="row" item xs={6} spacing={2} sx={{ justifyContent: 'space-evenly' }}>
        <Grid item sx={{ ml: '4px' }}>
          <StyledToggleButtonGroup exclusive orientation="vertical" size="small" onChange={handleVote}>
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
        </Grid>
        <Grid item>
          <Box sx={{ ...votesCardStyle }}>
            <Typography variant="subtitle1" color="primary.main">
              {surveyVotesAmount} Votes
            </Typography>
            <Typography variant="caption" color="primary.main">
              Um die Ergebnisse zu sehen, bitte gib deine Stimme ab.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

const votesCardStyle = {
  width: '172px',
  height: '120px',
  display: 'flex',
  padding: 'var(--2, 16px)',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: 'var(--1, 8px)',
  flexShrink: 0,
  borderRadius: 'var(--1, 8px)',
  background: 'rgba(0, 90, 140, 0.10)',
};
