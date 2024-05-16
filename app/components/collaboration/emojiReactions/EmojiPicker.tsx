import * as React from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import Popper from '@mui/material/Popper';
import useMediaQuery from '@mui/material/useMediaQuery';

import theme from '@/styles/theme';

interface EmojiPickerCardProps {
  isEmojiPickerClicked: boolean;
  setEmojiPickerClicked: React.Dispatch<React.SetStateAction<boolean>>;
  handleEmojiSelection: (emoji: { shortCode: string; nativeSymbol: string }) => void;
  anchorElement: HTMLDivElement | null | undefined;
}

export default function EmojiPickerCard(props: EmojiPickerCardProps) {
  const { isEmojiPickerClicked, setEmojiPickerClicked, handleEmojiSelection, anchorElement } = props;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Popper open={isEmojiPickerClicked} placement="bottom-start" anchorEl={anchorElement} sx={{ zIndex: 100 }}>
      <Picker
        saveFeedback
        data={data}
        previewPosition={isSmallScreen ? 'none' : 'bottom'}
        maxFrequentRows={isSmallScreen ? 1 : 4}
        skinTonePosition={isSmallScreen ? 'none' : 'preview'}
        navPosition={isSmallScreen ? 'none' : 'top'}
        perLine={isSmallScreen ? 6 : 9}
        onEmojiSelect={(emoji: { shortcodes: string; native: string }) =>
          handleEmojiSelection({ shortCode: emoji.shortcodes, nativeSymbol: emoji.native })
        }
        onClickOutside={() => setEmojiPickerClicked(!isEmojiPickerClicked)}
      />
    </Popper>
  );
}
