import { useEffect, useState } from 'react';

import { SxProps } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useProject } from '@/app/contexts/project-context';
import { SurveyQuestion } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import theme from '@/styles/theme';

import { getUserVoted, handleSurveyVote } from './actions';
import { SurveyReponsePickerLoadingSkeleton } from './SurveyReponsePickerLoadingSkeleton';
import { SurveyResponsePicker } from './SurveyResponsePicker';

interface SurveyCardProps {
  projectId: string;
  surveyQuestion: SurveyQuestion;
}

export const SurveyCard = (props: SurveyCardProps) => {
  const { isLoading, selectedOption, voteCount, handleVote } = useSurveyCard(props);
  const { surveyQuestion } = props;

  return (
    <Grid container item>
      <Grid container item xs={12} md={6} direction="column" sx={leftGridStyles}>
        <Grid item>
          <Typography variant="h5" color="secondary.contrastText">
            {surveyQuestion.question}
          </Typography>
        </Grid>
      </Grid>

      <Grid item xs={12} md={6} sx={rightGridStyles}>
        {isLoading ? (
          <SurveyReponsePickerLoadingSkeleton />
        ) : (
          <SurveyResponsePicker
            sx={{
              alignItems: 'center',
              display: { md: 'block', lg: 'flex' },
            }}
            handleVote={handleVote}
            selectedOption={selectedOption}
            responseOptions={surveyQuestion.responseOptions}
            voteCount={voteCount}
          />
        )}
      </Grid>
    </Grid>
  );
};

function useSurveyCard({ projectId, surveyQuestion }: SurveyCardProps) {
  const [isLoadingSelectedOption, setIsLoadingSelectedOption] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string>();

  const { surveyVotesAmount, isLoadingSurveyVotesAmount, setSurveyVotesAmount } = useProject();

  const hasVoted = selectedOption !== undefined;

  const updateVoteState = (vote: string) => {
    if (selectedOption === vote) {
      setSelectedOption(undefined);
      setSurveyVotesAmount((prev) => Math.max(0, prev - 1));
    } else {
      setSelectedOption(vote);
      if (!hasVoted) setSurveyVotesAmount((prev) => prev + 1);
    }
  };

  const handleVote = async (vote: string) => {
    try {
      updateVoteState(vote);
      await handleSurveyVote({ projectId, surveyQuestionId: surveyQuestion.id, vote });
    } catch (error) {
      console.error('Failed to handle vote:', error);
      errorMessage({ message: 'Failed to submit your vote. Please try again.' });
    }
  };

  useEffect(() => {
    async function loadAndSetSelectedVoteOption() {
      try {
        const { data: userVote } = await getUserVoted({ surveyQuestionId: surveyQuestion.id });
        if (userVote) {
          setSelectedOption(userVote.vote);
        }
      } catch (error) {
        console.error('Failed to load and set selected vote option', error);
        errorMessage({ message: 'Failed to load your voting status. Please try again.' });
      }
    }
    loadAndSetSelectedVoteOption().then(() => {
      setIsLoadingSelectedOption(false);
    });
  }, [surveyQuestion.id]);

  return {
    isLoading: isLoadingSelectedOption || isLoadingSurveyVotesAmount,
    voteCount: surveyVotesAmount,
    selectedOption,
    handleVote,
  };
}

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
