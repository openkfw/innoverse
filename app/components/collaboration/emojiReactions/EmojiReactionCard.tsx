'use client';

import { useMemo, useState } from 'react';

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
      errorMessage({ message: 'Updating your reaction failed. Please try again.' }); // Use your custom error handling here
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
  height: '1.6em',
  minWidth: '.1em',
  width: '3rem',
  bgcolor: 'background.paper',
  borderStyle: 'solid',
  borderRadius: '4px',
  borderWidth: 'thin',
  borderColor: 'InactiveBorder',
  m: '.3em',
  p: '.8em',
};

const activeReactionCardButtonStyles = {
  height: '1.6em',
  minWidth: '.1em',
  width: '3rem',
  bgcolor: 'inherit',
  borderStyle: 'solid',
  borderRadius: '4px',
  borderWidth: 'thin',
  borderColor: '#E7E6E2',
  m: '.3em',
  p: '1em',
};

const addNewReactionButtonStyles = {
  height: '1.6em',
  minWidth: '.1em',
  width: '1rem',
  bgcolor: 'rgba(0, 0, 0, 0)',
  mr: '.3em',
  p: '1em',
  borderRadius: '4px',
  color: 'text.primary',
  '&:hover': {
    color: 'text.primary',
    bgcolor: 'secondary.main',
  },
};
