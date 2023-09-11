import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import EditIcon from '@mui/icons-material/Edit';
import FormatAlignLeftOutlinedIcon from '@mui/icons-material/FormatAlignLeftOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SendIcon from '@mui/icons-material/Send';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import Button, { ButtonProps } from '@mui/material/Button';
import { SxProps } from '@mui/material/styles';

interface InteractionButtonProps extends ButtonProps {
  interactionType: InteractionType;
  label?: string;
  onClick?: () => void;
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
}

export default function InteractionButton(props: InteractionButtonProps) {
  const { interactionType, label, onClick, sx } = props;

  const getInteractionIcon = () => {
    if (interactionType === InteractionType.LIKE) return <ThumbUpOutlinedIcon fontSize="small" />;
    if (interactionType === InteractionType.PROJECT_FOLLOW) return <BookmarkAddOutlinedIcon fontSize="small" />;
    if (interactionType === InteractionType.USER_FOLLOW) return <PersonAddIcon fontSize="small" />;
    if (interactionType === InteractionType.COLLABORATION) return <PeopleOutlineOutlinedIcon fontSize="small" />;
    if (interactionType === InteractionType.COMMENT) return <ChatBubbleOutlineOutlinedIcon />;
    if (interactionType === InteractionType.COMMENT_SEND) return <SendIcon fontSize="small" />;
    if (interactionType === InteractionType.SHARE_OPINION) return <EditIcon fontSize="small" />;
    if (interactionType === InteractionType.ADD_INSIGHTS) return <FormatAlignLeftOutlinedIcon fontSize="small" />;
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
  };

  return (
    <Button
      onClick={onClick}
      variant="outlined"
      startIcon={getInteractionIcon()}
      sx={{
        mr: 1,
        px: 2,
        py: 1,
        color: 'rgba(0, 0, 0, 0.56)',
        borderRadius: '48px',
        fontFamily: 'Arial',
        fontSize: '13px',
        fontWeight: '700',
        lineHeight: '19px',
        border: ' 1px solid rgba(0, 0, 0, 0.10)',
        background: 'rgba(255, 255, 255, 0.10)',
        '&:hover': {
          border: '1px solid rgba(255, 255, 255, 0.40)',
          background: 'secondary.main',
        },
        '&:active': {
          border: '1px solid rgba(255, 255, 255, 0.40)',
          background: 'palette.secondary.main',
        },
        ...sx,
      }}
    >
      {getButtontext()}
    </Button>
  );
}
