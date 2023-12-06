'use client';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';

import CustomDialog from '@/components/common/CustomDialog';
import InteractionButton, { InteractionType } from '@/components/common/InteractionButton';

function FeedbackSection() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(3);
  const [hideButton, setHideButton] = useState(true);

  useEffect(() => {
    const navigationEntries = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
      setHideButton(false);
      sessionStorage.setItem('feedbackClosed', 'false');
    } else {
      setHideButton(sessionStorage.getItem('feedbackClosed') === 'true');
    }
  }, []);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function hideFeedbackButton() {
    sessionStorage.setItem('feedbackClosed', 'true');
    setHideButton(true);
  }

  return (
    <Box sx={feedbackSectionStyles}>
      {!hideButton && (
        <InteractionButton
          onClick={handleOpen}
          sx={feedbackButtonStyles}
          onIconClick={hideFeedbackButton}
          interactionType={InteractionType.FEEDBACK}
        />
      )}
      <CustomDialog
        open={open}
        handleClose={handleClose}
        title="Send feedback"
        subtitle="Erzählen Sie von Ihren Erfahrungen mit der neuen Innovationsplattform!"
      >
        <Box sx={bodyStyles}>
          <Rating
            name="simple-controlled"
            value={rating}
            onChange={(_, newValue) => {
              setRating(newValue !== null ? newValue : 0);
            }}
            sx={{ maxWidth: 140 }}
          />

          <TextField
            rows={6}
            multiline
            sx={textFieldStyles}
            placeholder="Das Feedback ist anonym. Du kannst hier dein Feedback eingeben."
            InputProps={{
              endAdornment: <InteractionButton interactionType={InteractionType.COMMENT_SEND} sx={buttonStyles} />,
            }}
          />
        </Box>
      </CustomDialog>
    </Box>
  );
}

export default FeedbackSection;

// Feedback Section Styles
const feedbackSectionStyles = {
  width: '100%',
  marginTop: '-100px',
  paddingRight: '32px',
  display: 'flex',
  justifyContent: 'flex-end',
};

const feedbackButtonStyles = {
  color: 'black',
  backgroundColor: 'white',
  zIndex: 2,
  position: 'fixed',
  bottom: 32,
  right: 32,
};

const bodyStyles = {
  display: 'flex',
  flexDirection: 'column',
  borderTop: '1px solid rgba(0, 90, 140, 0.10)',
  paddingTop: 3,
  marginTop: 2,
  width: 'min(760px,80vw)',
};

const textFieldStyles = {
  marginTop: 2,
  marginBottom: 2,
  borderRadius: 1,
  width: '100%',
  '& .MuiInputBase-root': {
    p: '22px 24px',
    color: 'text.primary',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'text.primary',
    },
  },
};

const buttonStyles = {
  bottom: 22,
  right: 24,
  position: 'absolute',
};
