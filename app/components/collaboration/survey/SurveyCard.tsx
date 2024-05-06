import { useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import Grid from '@mui/material/Grid';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useProject } from '@/app/contexts/project-context';
import { SurveyQuestion } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import theme from '@/styles/theme';

import { handleSurveyVote } from './actions';
import { SurveyResponsePicker } from './SurveyResponsePicker';

export interface SurveyVotes {
  surveyId: string;
  totalVotes: number;
  optionsWithVotes: { option: string; votes: number; percentage: number }[];
}

interface SurveyCardProps {
  projectId: string;
  surveyQuestion: SurveyQuestion;
}

export const SurveyCard = (props: SurveyCardProps) => {
  const { selectedOption, handleVote, votesPerOption } = useSurveyCard(props);
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
        {
          <SurveyResponsePicker
            sx={{
              alignItems: { md: 'center', lg: 'flex-start' },
              display: { md: 'block', lg: 'flex' },
              '@media (max-width: 1360px)': { display: 'block' },
            }}
            handleVote={handleVote}
            selectedOption={selectedOption}
            responseOptions={surveyQuestion.responseOptions}
            votesPerOption={votesPerOption.optionsWithVotes}
          />
        }
      </Grid>
    </Grid>
  );
};

function useSurveyCard({ projectId, surveyQuestion }: SurveyCardProps) {
  const { surveyQuestions } = useProject();

  const surveyVoteResponses = surveyQuestions
    .map((surveyQuestion) => {
      return {
        surveyId: surveyQuestion.id,
        totalVotes: surveyQuestion.votes.length,
        optionsWithVotes: surveyQuestion.responseOptions.reduce(
          (acc, option) => {
            const votes = surveyQuestion.votes.filter((vote) => vote.vote === option.responseOption).length || 0;
            const totalVotes = surveyQuestion.votes.length;
            acc.push({
              option: option.responseOption,
              votes: votes,
              percentage: Math.round((votes / totalVotes) * 100) || 0,
            });
            return acc;
          },
          [] as { votes: number; option: string; percentage: number }[],
        ),
      };
    })
    .find((vote) => vote.surveyId === surveyQuestion.id);

  const [selectedOption, setSelectedOption] = useState(surveyQuestion.userVote);
  const [votesPerOption, setVotesPerOption] = useState(surveyVoteResponses);
  const appInsights = useAppInsightsContext();

  const hasVoted = selectedOption !== undefined;

  const voteSetter = (action: 'INCREMENT' | 'DECREMENT', vote: string) => {
    const operation = action === 'INCREMENT' ? 1 : -1;

    setVotesPerOption((prev) => {
      if (!prev) return { surveyId: surveyQuestion.id, totalVotes: 0, optionsWithVotes: [] };
      const updatedOptions = prev.optionsWithVotes.map((option) => {
        return {
          ...option,
          votes: option.option === vote ? option.votes + operation : option.votes,
          percentage:
            Math.round(
              ((option.option === vote ? option.votes + operation : option.votes) / (prev.totalVotes + operation)) *
                100,
            ) || 0,
        };
      });

      return {
        surveyId: prev.surveyId,
        totalVotes: prev.totalVotes + operation,
        optionsWithVotes: updatedOptions,
      };
    });
  };

  const updateVoteState = (vote: string) => {
    if (selectedOption === vote) {
      setSelectedOption(undefined);
      voteSetter('DECREMENT', vote);
    } else {
      setSelectedOption(vote);
      voteSetter('INCREMENT', vote);
      if (hasVoted) {
        voteSetter('DECREMENT', selectedOption);
      }
    }
  };

  const handleVote = async (vote: string) => {
    try {
      updateVoteState(vote);
      await handleSurveyVote({ projectId, surveyQuestionId: surveyQuestion.id, vote });
    } catch (error) {
      console.error('Failed to handle vote:', error);
      errorMessage({ message: 'Failed to submit your vote. Please try again.' });
      appInsights.trackException({
        exception: new Error('Failed to submit vote.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  return {
    votesPerOption: votesPerOption || { surveyId: surveyQuestion.id, totalVotes: 0, optionsWithVotes: [] },
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
