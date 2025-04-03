'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { StatusCodes } from 'http-status-codes';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import FormGroup from '@mui/material/FormGroup';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

import CustomDialog from '@/components/common/CustomDialog';
import InteractionButton, { InteractionType } from '@/components/common/InteractionButton';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';
import { getCurrentCheckinQuestions } from '@/utils/requests/checkinQuestions/requests';

import { saveDailyCheckin } from './actions';

interface CheckinQuestionWithVote {
  checkinQuestionId: string;
  question: string;
  vote: number | null;
}

const marks = [
  {
    value: 1,
    label: '1',
  },
  {
    value: 2,
    label: '2',
  },
  {
    value: 3,
    label: '3',
  },
  {
    value: 4,
    label: '4',
  },
  {
    value: 5,
    label: '5',
  },
];
function CheckinSection() {
  const [open, openDialog] = useState(false);
  const [hideButton, setHideButton] = useState(false);

  const [checkinQuestions, setCheckinQuestions] = useState<CheckinQuestionWithVote[]>();
  const [dailyCheckinVotes, setDailyCheckinVotes] = useState<{ checkinQuestionId: string; vote: number }[]>([]);

  useEffect(() => {
    async function loadAndSetCheckinQuestion() {
      const response = await getCurrentCheckinQuestions({});

      if (!response || !response.data) {
        toast.error(m.components_layout_checkinSection_saveCheckin_toastError());
      } else {
        setCheckinQuestions(response.data);
      }
    }

    loadAndSetCheckinQuestion();
  }, []);

  function handleOpen() {
    openDialog(true);
  }

  function handleClose() {
    openDialog(false);
    setDailyCheckinVotes([]);
  }

  function hideFeedbackButton() {
    setHideButton(true);
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
    } else {
      toast.error(m.components_layout_checkinSection_saveCheckin_toastError());
    }
  };

  return (
    <Box sx={feedbackSectionStyles}>
      {!hideButton && (
        <InteractionButton
          onClick={handleOpen}
          sx={feedbackButtonStyles}
          onIconClick={hideFeedbackButton}
          interactionType={InteractionType.DAILY_CHECKIN}
        />
      )}

      <CustomDialog
        open={open}
        handleClose={handleClose}
        title={
          <Typography variant="caption" sx={titleStyles} component="div">
            {m.components_layout_checkinSection_checkinSection_title()}
          </Typography>
        }
        subtitle={
          <Typography variant="subtitle1" sx={subtitleStyles} component="div">
            {m.components_layout_checkinSection_checkinSection_description()}
          </Typography>
        }
      >
        <FormGroup>
          {checkinQuestions?.map((question, index) => (
            <Box key={index}>
              <Divider textAlign="left" />
              <Typography variant="body1" color="text.primary" sx={{ pt: 1 }}>
                {question.question}
              </Typography>
              <Box sx={{ my: 2, px: 1 }}>
                <Slider
                  step={1}
                  marks={marks}
                  min={1}
                  max={5}
                  size="medium"
                  onChange={(event, newValue) => handleVoteChange(question.checkinQuestionId, newValue as number)}
                />
              </Box>
            </Box>
          ))}
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
const feedbackSectionStyles = {
  width: '100%',
  paddingRight: '32px',
};

const feedbackButtonStyles = {
  color: 'black',
  backgroundColor: 'white',
  borderColor: 'secondary.main',
  border: '2px solid',

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
