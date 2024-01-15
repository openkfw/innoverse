import * as React from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import Box from '@mui/material/Box';

import { handleReactionClick } from './EmojiReactionCard';
import { Reaction } from './emojiReactionTypes';

interface EmojiPickerCardProps {
  isEmojiPickerClicked: boolean;
  setEmojiPickerClicked: React.Dispatch<React.SetStateAction<boolean>>;
  updateId: string;
  setReactionChange: React.Dispatch<React.SetStateAction<boolean>>;
  userReaction?: Reaction;
}

export default function EmojiPickerCard(props: EmojiPickerCardProps) {
  const { isEmojiPickerClicked, setEmojiPickerClicked, userReaction, updateId, setReactionChange } = props;

  return (
    <Box sx={{ position: 'absolute', width: '368px' }}>
      {isEmojiPickerClicked && (
        <Picker
          data={data}
          onEmojiSelect={(emoji: { shortcodes: string; native: string }) =>
            handleReactionClick({
              emoji: { shortCode: emoji.shortcodes, nativeSymbol: emoji.native },
              updateId,
              setReactionChange,
              userReaction,
            })
          }
          onClickOutside={() => setEmojiPickerClicked(!isEmojiPickerClicked)}
        />
      )}
    </Box>
  );
}
