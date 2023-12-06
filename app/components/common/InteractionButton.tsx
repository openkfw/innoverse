'use client';

import { useState } from 'react';

import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import FormatAlignLeftOutlinedIcon from '@mui/icons-material/FormatAlignLeftOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SendIcon from '@mui/icons-material/Send';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { Box } from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button';
import { SxProps } from '@mui/material/styles';

import triggerAnalyticsEvent from '@/analytics/analytics';
import ApplyIcon from '@/components/icons/ApplyIcon';
import ChatIcon from '@/components/icons/ChatIcon';
import CloseIcon from '@/components/icons/CloseIcon';
import RecommendIcon from '@/components/icons/RecommendIcon';

interface InteractionButtonProps extends ButtonProps {
  interactionType: InteractionType;
  projectName?: string;
  label?: string;
  onClick?: () => void;
  onIconClick?: () => void;
  sx?: SxProps;
}

export enum InteractionType {
  LIKE = 'like',
  PROJECT_FOLLOW = 'project-follow',
  USER_FOLLOW = 'user-follow',
  COLLABORATION = 'collaboration',
  COMMENT = 'comment',
  COMMENT_SEND = 'comment-send',
  SHARE_OPINION = 'share-opinion',
  ADD_INSIGHTS = 'add-insights',
  APPLY = 'apply',
  RECOMMEND = 'recommend',
  FEEDBACK = 'feedback',
  LOG_IN = 'log-in',
  CLEAR = 'clear',
}

export default function InteractionButton(props: InteractionButtonProps) {
  const { interactionType, label, onClick, onIconClick, sx, projectName } = props;
  const [isHovered, setIsHovered] = useState(false);

  const getInteractionIcon = () => {
    if (interactionType === InteractionType.LIKE) return <ThumbUpOutlinedIcon fontSize="small" />;
    if (interactionType === InteractionType.PROJECT_FOLLOW) return <BookmarkAddOutlinedIcon fontSize="small" />;
    if (interactionType === InteractionType.USER_FOLLOW) return <PersonAddIcon fontSize="small" />;
    if (interactionType === InteractionType.COLLABORATION) return <PeopleOutlineOutlinedIcon fontSize="small" />;
    if (interactionType === InteractionType.COMMENT) return <ChatIcon color={isHovered ? 'white' : 'black'} />;
    if (interactionType === InteractionType.COMMENT_SEND) return <SendIcon fontSize="small" />;
    if (interactionType === InteractionType.SHARE_OPINION) return <EditIcon fontSize="small" />;
    if (interactionType === InteractionType.ADD_INSIGHTS) return <FormatAlignLeftOutlinedIcon fontSize="small" />;
    if (interactionType === InteractionType.APPLY) return <ApplyIcon color={isHovered ? 'white' : 'black'} />;
    if (interactionType === InteractionType.RECOMMEND) return <RecommendIcon color={isHovered ? 'white' : 'black'} />;
    if (interactionType === InteractionType.LOG_IN) return <PersonIcon fontSize="small" />;
    if (interactionType === InteractionType.CLEAR) return <ClearIcon fontSize="small" />;
  };

  function handleIconClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (onIconClick) onIconClick();
  }

  const getEndIcon = () => {
    if (interactionType === InteractionType.FEEDBACK) {
      return (
        <Box onClick={handleIconClick}>
          <CloseIcon color="black" />
        </Box>
      );
    }
  };

  const getButtontext = () => {
    if (label) return label;
    if (interactionType === InteractionType.LIKE) return 'Like';
    if (interactionType === InteractionType.PROJECT_FOLLOW) return 'Projekt folgen';
    if (interactionType === InteractionType.USER_FOLLOW) return 'Folgen';
    if (interactionType === InteractionType.COLLABORATION) return 'Hilf uns!';
    if (interactionType === InteractionType.COMMENT_SEND) return 'Senden';
    if (interactionType === InteractionType.SHARE_OPINION) return 'Teile Deine Erfahrung';
    if (interactionType === InteractionType.COMMENT) return;
    if (interactionType === InteractionType.ADD_INSIGHTS) return 'Teile Deine Erfahrung';
    if (interactionType === InteractionType.APPLY) return 'Ich bin dabei';
    if (interactionType === InteractionType.RECOMMEND) return 'Ich kenne jemanden';
    if (interactionType === InteractionType.FEEDBACK) return 'FEEDBACK';
    if (interactionType === InteractionType.LOG_IN) return 'Log in';
    if (interactionType === InteractionType.CLEAR) return 'Entfernen';
  };

  const handleClick = () => {
    triggerAnalyticsEvent(interactionType.toString(), projectName || 'unknown-project');
    if (onClick !== undefined) onClick();
  };

  return (
    <Button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variant="outlined"
      startIcon={getInteractionIcon()}
      endIcon={getEndIcon()}
      sx={{
        mr: 1,
        px: getButtontext() === undefined ? 1 : 2,
        py: 1,
        color: 'rgba(0, 0, 0, 0.56)',
        borderRadius: '48px',
        fontFamily: 'Arial',
        fontSize: '13px',
        fontWeight: '700',
        lineHeight: '19px',
        border: ' 1px solid rgba(0, 0, 0, 0.10)',
        background: 'rgba(255, 255, 255, 0.10)',
        minWidth: 0,
        height: '35px',
        '&:hover': {
          border: '1px solid rgba(255, 255, 255, 0.40)',
          background: 'secondary.main',
        },
        '&:active': {
          border: '1px solid rgba(255, 255, 255, 0.40)',
          background: 'palette.secondary.main',
        },
        '& .MuiButton-startIcon': {
          margin: getButtontext() === undefined ? 0 : undefined,
        },
        ...sx,
      }}
    >
      {getButtontext()}
    </Button>
  );
}
