import * as React from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import Box from '@mui/material/Box';

interface EmojiPickerCardProps {
  isEmojiPickerClicked: boolean;
  setEmojiPickerClicked: React.Dispatch<React.SetStateAction<boolean>>;
  handleEmojiSelection: (emoji: { shortCode: string; nativeSymbol: string }) => void;
}

export default function EmojiPickerCard(props: EmojiPickerCardProps) {
  const { isEmojiPickerClicked, setEmojiPickerClicked, handleEmojiSelection } = props;

  return (
    <Box sx={{ position: 'absolute', width: '368px' }}>
      {isEmojiPickerClicked && (
        <Box sx={{ position: 'absolute', zIndex: 9999 }}>
          <Picker
            saveFeedback
            data={data}
            onEmojiSelect={(emoji: { shortcodes: string; native: string }) =>
              handleEmojiSelection({ shortCode: emoji.shortcodes, nativeSymbol: emoji.native })
            }
            onClickOutside={() => setEmojiPickerClicked(!isEmojiPickerClicked)}
          />
        </Box>
      )}
    </Box>
  );
}
