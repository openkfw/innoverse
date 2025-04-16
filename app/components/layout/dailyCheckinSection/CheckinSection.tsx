'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { StatusCodes } from 'http-status-codes';

import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';

import { useDailyCheckin } from '@/app/contexts/daily-checkin-context';
import CustomDialog from '@/components/common/CustomDialog';
import InteractionButton, { InteractionType } from '@/components/common/InteractionButton';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

import { saveDailyCheckin } from './actions';
import CheckinQuestionList from './CheckinQuestionList';
import CheckinQuestionVoteHistory from './CheckinQuestionVoteHistory';

function CheckinSection() {
  const [open, openDialog] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const { setDailyCheckinVotes, dailyCheckinVotes, checkinQuestionsToAnswer, voteHistory, refetchCheckinQuestions } =
    useDailyCheckin();

  function handleOpen() {
    openDialog(true);
  }

  function handleClose() {
    openDialog(false);
    setDailyCheckinVotes([]);
  }

  const handleVoteChange = (checkinQuestionId: string, newValue: number) => {
    setDailyCheckinVotes((prevVotes) => {
      const updatedVotes = prevVotes.filter((vote) => vote.checkinQuestionId !== checkinQuestionId);
      return [...updatedVotes, { checkinQuestionId, vote: newValue }];
    });
  };

  const submitVote = async () => {
    const result = await saveDailyCheckin({ dailyCheckinVotes });
    if (result.status === StatusCodes.OK) {
      toast.success(m.components_layout_checkinSection_saveCheckin_toastSuccess());
      handleClose();
      refetchCheckinQuestions();
    } else {
      toast.error(m.components_layout_checkinSection_saveCheckin_toastError());
    }
  };

  const getTitle = () => {
    return checkinQuestionsToAnswer.length
      ? m.components_layout_checkinSection_checkinSection_title()
      : m.components_layout_checkinSection_voteHistory_title();
  };

  const getSubtitle = () => {
    return checkinQuestionsToAnswer.length
      ? m.components_layout_checkinSection_checkinSection_description()
      : m.components_layout_checkinSection_voteHistory_description();
  };

  //todo hide button if no questions
  return (
    <Box sx={checkinSectionStyles}>
      {!hideButton && (
        <InteractionButton
          onClick={handleOpen}
          sx={checkinButtonStyles}
          interactionType={InteractionType.DAILY_CHECKIN}
        />
      )}

      <CustomDialog
        open={open}
        handleClose={handleClose}
        title={
          <Typography variant="caption" sx={titleStyles} component="div">
            {getTitle()}
          </Typography>
        }
        subtitle={
          <Typography variant="subtitle1" sx={subtitleStyles} component="div">
            {getSubtitle()}
          </Typography>
        }
      >
        <FormGroup>
          {checkinQuestionsToAnswer.length ? (
            <CheckinQuestionList checkinQuestions={checkinQuestionsToAnswer} handleVoteChange={handleVoteChange} />
          ) : (
            <CheckinQuestionVoteHistory voteHistory={voteHistory} />
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <InteractionButton
              onClick={() => submitVote()}
              interactionType={InteractionType.COMMENT_SEND}
              sx={buttonStyles}
              disabled={!dailyCheckinVotes.length}
            />
          </Box>
        </FormGroup>
      </CustomDialog>
    </Box>
  );
}

export default CheckinSection;

// Check-in Section Styles
const checkinSectionStyles = {
  px: '5px',
};

const checkinButtonStyles = {
  color: 'white',
  backgroundColor: 'primary.light',
  borderColor: 'secondary.main',
  border: '1.5px solid',
  borderRadius: '8px',
  pl: '-10',

  [theme.breakpoints.down('sm')]: {
    right: 'unset',
    left: 32,
    bottom: 48,
    padding: '8px 16px',
  },
};

const buttonStyles = {
  mt: 1.5,
};

const titleStyles = {
  textTransform: 'uppercase',
  fontWeight: '400',
  color: 'primary.light',
  marginTop: 1,
  fontSize: '12px',
};

const subtitleStyles = {
  color: 'text.primary',
  fontWeight: '400',
  marginTop: 1,
  fontSize: '16px',
  maxWidth: '700px',
  wordWrap: 'break-word',
};
