'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { StatusCodes } from 'http-status-codes';
import { useSessionStorage } from 'usehooks-ts';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import CustomDialog from '@/components/common/CustomDialog';
import InteractionButton, { InteractionType } from '@/components/common/InteractionButton';
import { saveFeedback } from '@/components/landing/feedbackSection/actions';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';
import { getPlatformFeedbackCollaborationQuestion } from '@/utils/requests/collaborationQuestions/requests';

const ProjectLink = ({
  children,
  projectId,
  navigateToCollaborationTab = false,
}: {
  children: React.ReactNode;
  projectId?: string;
  navigateToCollaborationTab?: boolean;
}) => (
  <Link
    href={projectId ? `/projects/${projectId}${navigateToCollaborationTab ? '?tab=1' : ''}` : '#'}
    style={{ textDecoration: 'none' }}
    target="_blank"
  >
    <Typography component="span" fontSize={'12px'} color={'text.secondary'}>
      {children}
    </Typography>
  </Link>
);

function FeedbackSection() {
  const [open, openDialog] = useState(false);
  // The useState and the useSessionStorage both must be used to avoid pre-hydration errors.
  const [feedbackClosed] = useSessionStorage('feedbackClosed', false);
  const [hideButton] = useState(feedbackClosed);
  const [projectId, setProjectId] = useState<string>();

  const [showFeedbackOnProjectPage, setShowFeedbackOnProjectPage] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    async function loadAndSetFeedbackProjectId() {
      const response = await getPlatformFeedbackCollaborationQuestion();
      setProjectId(response?.projectId);
    }

    loadAndSetFeedbackProjectId();
  });

  function handleOpen() {
    openDialog(true);
  }

  function handleClose() {
    openDialog(false);
  }

  const submitFeedback = async () => {
    const result = await saveFeedback({ feedback: feedbackText, showOnProjectPage: showFeedbackOnProjectPage });
    if (result.status === StatusCodes.OK) {
      toast.success(m.components_landing_feedbackSection_feedbackSection_toastSuccess());
      handleClose();
    } else {
      toast.error(m.components_landing_feedbackSection_feedbackSection_toastError());
    }
  };

  return (
    <Box sx={feedbackSectionStyles}>
      {!hideButton && (
        <InteractionButton onClick={handleOpen} sx={feedbackButtonStyles} interactionType={InteractionType.FEEDBACK} />
      )}
      <CustomDialog
        open={open}
        handleClose={handleClose}
        title={
          <Typography variant="caption" sx={titleStyles} component="div">
            {m.components_landing_feedbackSection_feedbackSection_giveFeedback()}
          </Typography>
        }
        subtitle={
          <Typography variant="subtitle1" sx={subtitleStyles} component="div">
            {m.components_landing_feedbackSection_feedbackSection_importantFeedbackMessage()}
          </Typography>
        }
      >
        <Box sx={bodyStyles}>
          <TextField
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={6}
            multiline
            sx={textFieldStyles}
            placeholder={m.components_landing_feedbackSection_feedbackSection_placeholderFeedback()}
          />
        </Box>
        <FormGroup>
          <Typography color={'text.primary'} fontSize={'12px'}>
            {m.components_landing_feedbackSection_feedbackSection_administratorFeedback()}{' '}
            <ProjectLink projectId={projectId}>
              {m.components_landing_feedbackSection_feedbackSection_projectpage()} &quot;
              {m.components_landing_feedbackSection_feedbackSection_innoPlatform()}&quot;
            </ProjectLink>{' '}
            {m.components_landing_feedbackSection_feedbackSection_yourData()}
          </Typography>
          <Stack direction={'row'} sx={{ mt: 1 }}>
            <FormControlLabel
              value="end"
              control={
                <Checkbox
                  checked={showFeedbackOnProjectPage}
                  onChange={() => setShowFeedbackOnProjectPage((prev) => !prev)}
                  sx={{
                    borderColor: 'black',
                    color: 'text.primary',
                    '&.Mui-checked': {
                      color: '#99A815',
                    },
                  }}
                />
              }
              label={
                <Typography color={'text.primary'} fontSize={'12px'}>
                  {m.components_landing_feedbackSection_feedbackSection_myfeedback()}{' '}
                  <ProjectLink projectId={projectId} navigateToCollaborationTab={true}>
                    {m.components_landing_feedbackSection_feedbackSection_initiativePage()}
                  </ProjectLink>{' '}
                  {m.components_landing_feedbackSection_feedbackSection_discussion()}
                </Typography>
              }
              labelPlacement="end"
              sx={{ flexGrow: 1 }}
            />
            <InteractionButton
              onClick={() => submitFeedback()}
              interactionType={InteractionType.COMMENT_SEND}
              sx={buttonStyles}
              disabled={!feedbackText.length}
            />
          </Stack>
        </FormGroup>
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
  zIndex: 5,
  position: 'fixed',
  bottom: 32,
  right: 32,

  [theme.breakpoints.down('sm')]: {
    right: 'unset',
    left: 32,
    bottom: 48,
    padding: '8px 16px',
  },
};

const bodyStyles = {
  display: 'flex',
  flexDirection: 'column',
  borderTop: '1px solid rgba(0, 90, 140, 0.10)',
  paddingTop: 3,
  marginTop: 2,
  width: 'min(760px,80vw)',
  maxWidth: '100%',
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
