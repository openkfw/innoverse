'use client';

import { useCallback, useEffect, useState } from 'react';

import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { errorMessage } from '@/components/common/CustomToast';

import { getEmojisByShortCodes } from './actions';
import EmojiPickerCard from './EmojiPicker';
import { CountReaction, Emoji, Reaction } from './emojiReactionTypes';

interface EmojiReactionCardProps {
  userReaction?: Reaction;
  countOfReactionsByShortCode: CountReaction[];
  handleReaction: (emoji: Emoji, operation: 'upsert' | 'delete') => void;
}

export function EmojiReactionCard({
  userReaction,
  countOfReactionsByShortCode,
  handleReaction,
}: EmojiReactionCardProps) {
  const [isEmojiPickerClicked, setIsEmojiPickerClicked] = useState(false);
  const [topReactionsWithEmojis, setTopReactionsWithEmojis] = useState<{ count: number; emoji: Emoji }[]>();

  const handleEmojiReaction = (emoji: Emoji) => {
    try {
      const operation = !userReaction || userReaction.reactedWith.shortCode !== emoji.shortCode ? 'upsert' : 'delete';
      handleReaction(emoji, operation);
    } catch (error) {
      console.error('Failed to update reaction:', error);
      errorMessage({ message: 'Updating your reaction failed. Please try again.' });
    }
  };

  const getTopReactions = useCallback(
    () => countOfReactionsByShortCode.sort((a, b) => b.count - a.count).slice(0, 3),
    [countOfReactionsByShortCode],
  );

  useEffect(() => {
    async function getTopReactionsWithEmojis() {
      try {
        const topReactions = getTopReactions();
        const shortCodes = topReactions.map((reaction) => reaction.shortCode);
        const { data: emojis } = await getEmojisByShortCodes({ shortCodes: shortCodes });

        // Match emojis to top reactions
        const topReactionsWithEmojis = topReactions
          .map((reaction) => {
            const emoji = emojis?.find((emoji) => emoji.shortCode === reaction.shortCode);
            if (!emoji) return null;
            return { count: reaction.count, emoji: emoji };
          })
          .filter((reaction) => reaction !== null) as { count: number; emoji: Emoji }[];

        setTopReactionsWithEmojis(topReactionsWithEmojis);
      } catch (error) {
        console.error('Failed to load emojis:', error);
        errorMessage({ message: 'Failed to load emojis. Please try again.' });
      }
    }

    getTopReactionsWithEmojis();
  }, [getTopReactions]);

  return (
    <Box>
      <Grid
        container
        direction="row"
        sx={{
          alignItems: 'center',
        }}
      >
        {topReactionsWithEmojis?.map((reaction, key) => {
          return (
            <Grid item key={key}>
              <Button
                onClick={() => handleEmojiReaction(reaction.emoji)}
                sx={
                  reaction.emoji.nativeSymbol === userReaction?.reactedWith.nativeSymbol
                    ? activeReactionCardButtonStyles
                    : reactionCardButtonStyles
                }
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
          <Button sx={addNewReactionButtonStyles} onClick={() => setIsEmojiPickerClicked((isClicked) => !isClicked)}>
            <AddReactionOutlinedIcon sx={addNewReactionIconStyles} />
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
  bgcolor: 'success.light',
  borderStyle: 'solid',
  borderRadius: '4px',
  borderWidth: 'thin',
  borderColor: 'secondary.main',
  m: '.2em',
  p: '.3em',
};

const addNewReactionButtonStyles = {
  height: '1.6em',
  minWidth: '.1em',
  width: '1rem',
  bgcolor: 'background.paper',
  mr: '.3em',
  p: '1em',
  borderRadius: '4px',
  color: 'text.primary',
  '&:hover': {
    color: 'secondary.main',
    bgcolor: 'background.paper',
  },
};

const addNewReactionIconStyles = {
  fontSize: 24,
};
