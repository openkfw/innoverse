'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import {
  getAllReactionsForUpdate,
  getCountPerEmojiOnUpdate,
  getReactionForUpdateAndUser,
  handleNewReaction,
} from './actions';
import EmojiPickerCard from './EmojiPicker';
import { CountReaction, Emoji, Reaction } from './emojiReactionTypes';

interface EmojiReactionCardProps {
  updateId: string;
}

export default function EmojiReactionCard({ updateId }: EmojiReactionCardProps) {
  const [isEmojiPickerClicked, setEmojiPickerClicked] = useState(false);
  const [reactionsArray, setReactionsArray] = useState<Reaction[]>([]);
  const [countingArray, setCountingArray] = useState<CountReaction[]>([]);
  const [userReaction, setUserReaction] = useState<Reaction>();
  const [reactionChange, setReactionChange] = useState(false);

  const fetchReactions = useCallback(async () => {
    const { data: reactionsServerResponseData } = await getAllReactionsForUpdate({ updateId });
    setReactionsArray(reactionsServerResponseData ?? []);
    const { data: userReactionFromServer } = await getReactionForUpdateAndUser({ updateId });
    setUserReaction(userReactionFromServer ?? undefined);
    const { data: countOfReactionsByUpdateAndShortcode } = await getCountPerEmojiOnUpdate({
      updateId,
    });

    countOfReactionsByUpdateAndShortcode &&
      setCountingArray(
        countOfReactionsByUpdateAndShortcode?.map(
          (element: { reactionShortCode: string; _count: { reactionShortCode: number } }) => ({
            shortCode: element.reactionShortCode || 'XXXX',
            count: element._count.reactionShortCode || 0,
          }),
        ),
      );
  }, [reactionChange, updateId]);

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  const topReactions = useMemo(() => {
    return (
      countingArray
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        // This next line maps each reaction in the top 3 to a specific Reaction Object in the reactionArray.
        // This is necessary to display the native Symbol in the front end.
        .map((countItem) => reactionsArray.find((r) => r.reactedWith.shortCode === countItem.shortCode) ?? null)
        .filter((item) => item !== null)
    );
  }, [countingArray, reactionsArray]);

  return (
    <Box>
      <Grid
        container
        direction="row"
        sx={{
          alignItems: 'center',
        }}
      >
        {topReactions.map((item, key) => {
          const emojiCount =
            countingArray.find((countItem) => countItem.shortCode === item?.reactedWith.shortCode)?.count || 0;
          return (
            <Grid item key={key}>
              <Button
                onClick={() => {
                  if (item) {
                    handleReactionClick({
                      emoji: { shortCode: item.reactedWith.shortCode, nativeSymbol: item.reactedWith.nativeSymbol },
                      updateId,
                      setReactionChange,
                      userReaction,
                    });
                  }
                }}
                sx={
                  item?.reactedWith.nativeSymbol === userReaction?.reactedWith.nativeSymbol
                    ? activeReactionCardButtonStyles
                    : reactionCardButtonStyles
                }
              >
                {item?.reactedWith.nativeSymbol || 'X'}
                <Typography variant="caption" sx={{ color: 'text.primary' }}>
                  {emojiCount}
                </Typography>
              </Button>
            </Grid>
          );
        })}

        <Grid item>
          <Button sx={addNewReactionButtonStyles} onClick={() => setEmojiPickerClicked(!isEmojiPickerClicked)}>
            <AddReactionOutlinedIcon sx={addNewReactionIconStyles} />
          </Button>
        </Grid>
      </Grid>
      <EmojiPickerCard
        isEmojiPickerClicked={isEmojiPickerClicked}
        setEmojiPickerClicked={setEmojiPickerClicked}
        updateId={updateId}
        setReactionChange={setReactionChange}
        userReaction={userReaction}
      />
    </Box>
  );
}

type ReactionClick = {
  emoji: Emoji;
  updateId: string;
  setReactionChange: React.Dispatch<React.SetStateAction<boolean>>;
  userReaction?: Reaction;
};

export const handleReactionClick = async (reactionClick: ReactionClick) => {
  const { emoji, updateId, setReactionChange, userReaction } = reactionClick;
  if (!userReaction) {
    await handleNewReaction({
      updateId,
      operation: 'upsert',
      emoji,
    });

    setReactionChange((prev) => !prev);
  } else if (userReaction && userReaction.reactedWith.shortCode != emoji.shortCode) {
    await handleNewReaction({
      updateId: updateId,
      operation: 'upsert',
      emoji,
    });

    setReactionChange((prev) => !prev);
  } else if (userReaction && userReaction.reactedWith.shortCode === emoji.shortCode) {
    await handleNewReaction({
      updateId: updateId,
      operation: 'delete',
      emoji,
    });

    setReactionChange((prev) => !prev);
  }
};

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
