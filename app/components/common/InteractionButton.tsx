'use client';

import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/SendOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import { SxProps } from '@mui/material/styles';

import useHydration from '@/components/common/Hydration';
import ApplyIcon from '@/components/icons/ApplyIcon';
import ChatIcon from '@/components/icons/ChatIcon';
import CloseIcon from '@/components/icons/CloseIcon';
import RecommendIcon from '@/components/icons/RecommendIcon';
import * as m from '@/src/paraglide/messages.js';
import palette from '@/styles/palette';

import CustomTooltip from './CustomTooltip';

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
  ariaLabel?: string;
}

export enum InteractionType {
  LIKE = 'like',
  PROJECT_FOLLOW = 'project-follow',
  COLLABORATION = 'collaboration',
  COMMENT = 'comment',
  COMMENT_SEND = 'comment-send',
  SHARE_OPINION = 'share-opinion',
  OPPORTUNITY_APPLY = 'opportunity-apply',
  RECOMMEND = 'recommend',
  FEEDBACK = 'feedback',
  LOG_IN = 'log-in',
  CLEAR = 'clear',
  ADD_UPDATE = 'add-update',
  ALLOW_NOTIFICATIONS = 'allow-notifications',
  DISMISS_NOTIFICATION_BANNER = 'dismiss-notification-banner',
  ADD_POST = 'add-post',
  SHOW_PAST_EVENTS = 'show-past-events',
  DAILY_CHECKIN = 'daily-check-in',
}

export default function InteractionButton(props: InteractionButtonProps) {
  const {
    interactionType,
    label,
    onClick,
    onIconClick,
    sx,
    isSelected = false,
    disabled = false,
    tooltip,
    ariaLabel,
  } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [clicked, setClicked] = useState(isSelected);
  const { hydrated } = useHydration();

  const getSelectedInteractionIcon = () => {
    if (interactionType === InteractionType.PROJECT_FOLLOW) return <BookmarkAddedOutlinedIcon fontSize="small" />;
    if (interactionType === InteractionType.COMMENT) return <ChatIcon color={'black'} />;
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
    if (interactionType === InteractionType.OPPORTUNITY_APPLY) return <ApplyIcon color={getIconColor()} />;
    if (interactionType === InteractionType.RECOMMEND) return <RecommendIcon color={getIconColor()} />;
    if (interactionType === InteractionType.LOG_IN) return <PersonIcon fontSize="small" />;
    if (interactionType === InteractionType.CLEAR) return <ClearIcon fontSize="small" />;
    if (interactionType === InteractionType.PROJECT_FOLLOW) return <BookmarkAddOutlinedIcon fontSize="small" />;
    if (interactionType === InteractionType.ALLOW_NOTIFICATIONS) return <CheckOutlinedIcon fontSize="small" />;
    if (interactionType === InteractionType.DISMISS_NOTIFICATION_BANNER) return;
    if (interactionType === InteractionType.SHOW_PAST_EVENTS) return;
  };

  function handleIconClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (onIconClick) onIconClick();
  }

  const getEndIcon = () => {
    if (interactionType === InteractionType.LIKE) return <ThumbUpOutlinedIcon fontSize="small" />;
    if (interactionType === InteractionType.ADD_UPDATE || interactionType === InteractionType.ADD_POST)
      return <AddIcon fontSize="small" />;
    if (interactionType === InteractionType.FEEDBACK)
      return (
        <Box onClick={handleIconClick}>
          <CloseIcon color="black" />
        </Box>
      );
  };

  const getButtonText = () => {
    if (label) return label;
    if (interactionType === InteractionType.LIKE) return m.components_common_interactionButton_like();
    if (interactionType === InteractionType.PROJECT_FOLLOW) return m.components_common_interactionButton_follow();
    if (interactionType === InteractionType.COLLABORATION) return m.components_common_interactionButton_collaboration();
    if (interactionType === InteractionType.COMMENT_SEND) return m.components_common_interactionButton_commentSend();
    if (interactionType === InteractionType.SHARE_OPINION) return m.components_common_interactionButton_shareOpinion();
    if (interactionType === InteractionType.COMMENT) return;
    if (interactionType === InteractionType.OPPORTUNITY_APPLY) return m.components_common_interactionButton_apply();
    if (interactionType === InteractionType.RECOMMEND) return m.components_common_interactionButton_recommend();
    if (interactionType === InteractionType.FEEDBACK) return m.components_common_interactionButton_feedback();
    if (interactionType === InteractionType.LOG_IN) return m.components_common_interactionButton_logIn();
    if (interactionType === InteractionType.CLEAR) return m.components_common_interactionButton_clear();
    if (interactionType === InteractionType.ADD_UPDATE) return m.components_common_interactionButton_addUpdate();
    if (interactionType === InteractionType.ADD_POST) return m.components_common_interactionButton_addUpdate();
    if (interactionType === InteractionType.SHOW_PAST_EVENTS)
      return m.components_projectdetails_events_filteringPanel_previousTopics();
    if (interactionType === InteractionType.DAILY_CHECKIN) return m.components_common_interactionButton_dailyCheckin();
  };

  const getButtonTextClicked = () => {
    if (label) return label;
    if (interactionType === InteractionType.LIKE) return m.components_common_interactionButton_liked();
    if (interactionType === InteractionType.PROJECT_FOLLOW) return m.components_common_interactionButton_unfollow();
    if (interactionType === InteractionType.OPPORTUNITY_APPLY) return m.components_common_interactionButton_applied();
    else return getButtonText();
  };

  const getText = () => {
    return clicked || isSelected ? getButtonTextClicked() : getButtonText();
  };

  const handleClick = () => {
    setClicked(!clicked);
    if (onClick !== undefined) onClick();
  };

  const getIconColor = () => {
    if (disabled) {
      return 'grey';
    }
    if (isHovered) {
      return 'white';
    }
    if (isSelected || clicked) {
      return palette.secondary?.main;
    }
    return 'black';
  };

  const getBorderColor = () => {
    if (
      interactionType === InteractionType.COMMENT ||
      interactionType === InteractionType.FEEDBACK ||
      interactionType === InteractionType.ADD_UPDATE
    )
      return 'rgba(0, 0, 0, 0.10)';
    return isSelected || clicked ? 'secondary.main' : 'rgba(0, 0, 0, 0.10)';
  };

  const customButton = (
    <Button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variant="outlined"
      startIcon={isSelected || clicked ? getSelectedInteractionIcon() : getInteractionIcon()}
      endIcon={getEndIcon()}
      disabled={!hydrated || disabled}
      data-user-interaction-id={`${interactionType}-button`}
      data-teststate-active={clicked}
      aria-label={ariaLabel}
      sx={{
        px: getText() === undefined ? 1 : 2,
        py: 1,
        color: isSelected || clicked ? 'secondary.main' : 'rgba(0, 0, 0, 0.56)',
        fontFamily: 'Arial',
        fontSize: { xs: '12px', lg: '13px' },
        fontWeight: '700',
        lineHeight: { xs: '13px', md: '19px' },
        border: '1px solid',
        borderColor: getBorderColor(),
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
      <CustomTooltip tooltip={tooltip}>
        <span style={{ height: 'fit-content' }}>{customButton}</span>
      </CustomTooltip>
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
  fontFamily: 'SansDefaultReg',
  fontWeight: 700,
};
