'use client';

import { useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import FormatAlignLeftOutlinedIcon from '@mui/icons-material/FormatAlignLeftOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import { SxProps } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

import ApplyIcon from '@/components/icons/ApplyIcon';
import ChatIcon from '@/components/icons/ChatIcon';
import CloseIcon from '@/components/icons/CloseIcon';
import RecommendIcon from '@/components/icons/RecommendIcon';
import palette from '@/styles/palette';

export interface InteractionButtonProps extends ButtonProps {
  interactionType: InteractionType;
  projectName?: string;
  label?: string;
  onClick?: () => void;
  onIconClick?: () => void;
  sx?: SxProps;
  isSelected?: boolean;
  disabled?: boolean;
  tooltip?: string;
}

export enum InteractionType {
  LIKE = 'like',
  PROJECT_FOLLOW = 'project-follow',
  COLLABORATION = 'collaboration',
  COMMENT = 'comment',
  COMMENT_SEND = 'comment-send',
  SHARE_OPINION = 'share-opinion',
  ADD_INSIGHTS = 'add-insights',
  OPPORTUNITY_APPLY = 'opportunity-apply',
  RECOMMEND = 'recommend',
  FEEDBACK = 'feedback',
  LOG_IN = 'log-in',
  CLEAR = 'clear',
  ADD_UPDATE = 'add-update',
  OK = 'ok',
  DISMISS = 'dismiss',
}

export default function InteractionButton(props: InteractionButtonProps) {
  const { interactionType, label, onClick, onIconClick, sx, isSelected = false, disabled = false, tooltip } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    setClicked(isSelected);
  }, [isSelected]);

  const getSelectedInteractionIcon = () => {
    if (interactionType === InteractionType.PROJECT_FOLLOW) return <BookmarkAddedOutlinedIcon fontSize="small" />;
    else {
      return getInteractionIcon();
    }
  };

  const getInteractionIcon = () => {
    if (interactionType === InteractionType.LIKE) return;
    if (interactionType === InteractionType.COLLABORATION) return <PeopleOutlineOutlinedIcon fontSize="small" />;
    if (interactionType === InteractionType.COMMENT) return <ChatIcon color={getIconColor()} />;
    if (interactionType === InteractionType.COMMENT_SEND) return <SendIcon fontSize="small" />;
    if (interactionType === InteractionType.SHARE_OPINION) return <EditIcon fontSize="small" />;
    if (interactionType === InteractionType.ADD_INSIGHTS) return <FormatAlignLeftOutlinedIcon fontSize="small" />;
    if (interactionType === InteractionType.OPPORTUNITY_APPLY) return <ApplyIcon color={getIconColor()} />;
    if (interactionType === InteractionType.RECOMMEND) return <RecommendIcon color={getIconColor()} />;
    if (interactionType === InteractionType.LOG_IN) return <PersonIcon fontSize="small" />;
    if (interactionType === InteractionType.CLEAR) return <ClearIcon fontSize="small" />;
    if (interactionType === InteractionType.PROJECT_FOLLOW) return <BookmarkAddOutlinedIcon fontSize="small" />;
    if (interactionType === InteractionType.OK) return <CheckOutlinedIcon fontSize="small" />;
    if (interactionType === InteractionType.DISMISS) return;
  };

  function handleIconClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (onIconClick) onIconClick();
  }

  const getEndIcon = () => {
    if (interactionType === InteractionType.LIKE) return <ThumbUpOutlinedIcon fontSize="small" />;
    if (interactionType === InteractionType.ADD_UPDATE) return <AddIcon fontSize="small" />;
    if (interactionType === InteractionType.FEEDBACK)
      return (
        <Box onClick={handleIconClick}>
          <CloseIcon color="black" />
        </Box>
      );
  };

  const getButtonText = () => {
    if (label) return label;
    if (interactionType === InteractionType.LIKE) return 'Like';
    if (interactionType === InteractionType.PROJECT_FOLLOW) return 'Folgen';
    if (interactionType === InteractionType.COLLABORATION) return 'Hilf uns!';
    if (interactionType === InteractionType.COMMENT_SEND) return 'Senden';
    if (interactionType === InteractionType.SHARE_OPINION) return 'Teile Deine Erfahrung';
    if (interactionType === InteractionType.COMMENT) return;
    if (interactionType === InteractionType.ADD_INSIGHTS) return 'Teile Deine Erfahrung';
    if (interactionType === InteractionType.OPPORTUNITY_APPLY) return 'Ich bin dabei';
    if (interactionType === InteractionType.RECOMMEND) return 'Ich kenne jemanden';
    if (interactionType === InteractionType.FEEDBACK) return 'FEEDBACK';
    if (interactionType === InteractionType.LOG_IN) return 'Log in';
    if (interactionType === InteractionType.CLEAR) return 'Entfernen';
    if (interactionType === InteractionType.ADD_UPDATE) return 'Neuigkeit hinzufügen';
  };

  const getButtonTextClicked = () => {
    if (label) return label;
    if (interactionType === InteractionType.LIKE) return 'Liked';
    if (interactionType === InteractionType.PROJECT_FOLLOW) return 'Entfolgen';
    if (interactionType === InteractionType.OPPORTUNITY_APPLY) return 'Angewandt';
    else return getButtonText();
  };

  const getText = () => {
    return clicked ? getButtonTextClicked() : getButtonText();
  };

  const handleClick = () => {
    setClicked(!clicked);
    if (onClick !== undefined) onClick();
  };

  const getIconColor = () => {
    if (disabled) {
      return 'grey';
    }
    if (isSelected) {
      return palette.secondary?.main;
    }
    if (isHovered) {
      return 'white';
    }
    return 'black';
  };

  const customButton = (
    <Button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variant="outlined"
      startIcon={isSelected ? getSelectedInteractionIcon() : getInteractionIcon()}
      endIcon={getEndIcon()}
      disabled={disabled}
      sx={{
        px: getText() === undefined ? 1 : 2,
        py: 1,
        color: isSelected ? 'secondary.main' : 'rgba(0, 0, 0, 0.56)',
        fontFamily: 'Arial',
        fontSize: '13px',
        fontWeight: '700',
        lineHeight: '19px',
        border: '1px solid',
        borderColor: isSelected ? 'secondary.main' : 'rgba(0, 0, 0, 0.10)',
        background: 'rgba(255, 255, 255, 0.10)',
        minWidth: 0,
        height: '35px',
        '&:hover': {
          border: '1px solid rgba(255, 255, 255, 0.40)',
          background: 'secondary.main',
        },
        '&:active': {
          border: '1px solid rgba(255, 255, 255, 0.40)',
          background: 'secondary.main',
        },
        '& .MuiButton-startIcon': {
          margin: getText() === undefined ? 0 : undefined,
        },
        ...sx,
      }}
    >
      {getText()}
    </Button>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        <span style={{ height: 'fit-content' }}>{customButton}</span>
      </Tooltip>
    );
  }

  return customButton;
}

export const interactionButtonStyles = {
  color: 'common.white',
  borderRadius: '50px',
  border: '2px solid rgba(255, 255, 255, 0.40)',
  boxShadow: '0px 12px 32px 0px rgba(0, 0, 0, 0.25), 0px 4px 8px 0px rgba(0, 0, 0, 0.10)',
  backdropFilter: 'blur(24px)',
  ':hover': {
    border: '2px solid rgba(255, 255, 255, 0.40)',
  },
  fontSize: '20px',
  fontFamily: '***FONT_REMOVED***',
  fontWeight: 700,
};
