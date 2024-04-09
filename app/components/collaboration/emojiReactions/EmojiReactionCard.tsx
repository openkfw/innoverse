'use client';

import { useMemo, useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { errorMessage } from '@/components/common/CustomToast';

import EmojiPickerCard from './EmojiPicker';
import { Emoji, Reaction, ReactionCount } from './emojiReactionTypes';

interface EmojiReactionCardProps {
  userReaction?: Reaction;
  countOfReactions: ReactionCount[];
  handleReaction: (emoji: Emoji, operation: 'upsert' | 'delete') => void;
  sx?: SxProps;
}

export function EmojiReactionCard({ userReaction, countOfReactions, handleReaction, sx }: EmojiReactionCardProps) {
  const [isEmojiPickerClicked, setIsEmojiPickerClicked] = useState(false);
  const appInsights = useAppInsightsContext();

  const topReactions = useMemo(
    () => countOfReactions.sort((a, b) => b.count - a.count).slice(0, 3),
    [countOfReactions],
  );

  const handleEmojiReaction = (emoji: Emoji) => {
    try {
      // No Reaction before: Upsert
      // Reaction with different emoji: Upsert
      // Removal of emoji reaction: Delete
      const operation = !userReaction || userReaction.shortCode !== emoji.shortCode ? 'upsert' : 'delete';
      handleReaction(emoji, operation);
    } catch (error) {
      console.error('Failed to update reaction:', error);
      errorMessage({ message: 'Updating your reaction failed. Please try again.' });
      appInsights.trackException({
        exception: new Error('Updating reactions failed.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  return (
    <Box>
      <Grid
        container
        direction="row"
        sx={{
          alignItems: 'center',
          ...sx,
        }}
      >
        {topReactions?.map((reaction, key) => {
          return (
            <Grid item key={key}>
              <Button
                onClick={() => handleEmojiReaction(reaction.emoji)}
                sx={
                  reaction.emoji.nativeSymbol === userReaction?.nativeSymbol
                    ? activeReactionCardButtonStyles
                    : reactionCardButtonStyles
                }
                aria-label="React with emoji"
              >
                {reaction.emoji.nativeSymbol || 'X'}
                <Typography variant="caption" sx={{ color: 'text.primary' }}>
                  {reaction.count}
                </Typography>
              </Button>
            </Grid>
          );
        })}

        <Grid item>
          <Button
            sx={addNewReactionButtonStyles}
            data-user-interaction-id={`open-emoji-picker-button`}
            onClick={() => setIsEmojiPickerClicked((isClicked) => !isClicked)}
            aria-label="Add new reaction"
          >
            <AddReactionOutlinedIcon sx={{ fontSize: 24 }} />
          </Button>
        </Grid>
      </Grid>
      <EmojiPickerCard
        isEmojiPickerClicked={isEmojiPickerClicked}
        setEmojiPickerClicked={setIsEmojiPickerClicked}
        handleEmojiSelection={handleEmojiReaction}
      />
    </Box>
  );
}

const reactionCardButtonStyles = {
  height: '2.5em',
  minWidth: '.1em',
  width: '3rem',
  backgroundColor: 'background.paper',
  borderRadius: '2px',
  border: '1px solid #E7E6E2',
  bgcolor: 'rgba(0, 0, 0, 0)',
  p: '.8em',
  ml: '0.3em',
  '&:hover': {
    bgcolor: 'action.hover',
  },
};

const activeReactionCardButtonStyles = {
  height: '2.5em',
  minWidth: '.1em',
  width: '3rem',
  border: '2px solid',
  borderColor: 'action.hover',
  borderRadius: '2px',
  p: '1em',
  ml: '0.3em',
  bgcolor: 'rgba(0, 0, 0, 0)',
  color: 'text.primary',
  '&:hover': {
    bgcolor: 'action.hover',
  },
};

const addNewReactionButtonStyles = {
  height: '2.5em',
  minWidth: '.1em',
  width: '3rem',
  bgcolor: 'rgba(0, 0, 0, 0)',
  p: '1em',
  ml: '0.3em',
  borderRadius: '2px',
  color: 'text.primary',
  '&:hover': {
    bgcolor: 'action.hover',
  },
};
