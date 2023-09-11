import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import EditIcon from '@mui/icons-material/Edit';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SendIcon from '@mui/icons-material/Send';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import Button, { ButtonProps } from '@mui/material/Button';
import { SxProps } from '@mui/material/styles';

interface InteractionButtonProps extends ButtonProps {
  interactionType: InterfactionType;
  label?: string;
  onClick?: () => void;
  sx?: SxProps;
}

type InterfactionType =
  | 'like'
  | 'project-follow'
  | 'user-follow'
  | 'collaboration'
  | 'comment'
  | 'comment-send'
  | 'share-opinion';

export default function InteractionButton(props: InteractionButtonProps) {
  const { interactionType, label, onClick, sx } = props;

  const getInteractionIcon = () => {
    if (interactionType === 'like') return <ThumbUpOutlinedIcon fontSize="small" />;
    if (interactionType === 'project-follow') return <BookmarkAddOutlinedIcon fontSize="small" />;
    if (interactionType === 'user-follow') return <PersonAddIcon fontSize="small" />;
    if (interactionType === 'collaboration') return <PeopleOutlineOutlinedIcon fontSize="small" />;
    if (interactionType === 'comment') return <ChatBubbleOutlineOutlinedIcon />;
    if (interactionType === 'comment-send') return <SendIcon fontSize="small" />;
    if (interactionType === 'share-opinion') return <EditIcon fontSize="small" />;
  };

  const getButtontext = () => {
    if (label) return label;
    if (interactionType === 'like') return 'Like';
    if (interactionType === 'project-follow') return 'Projekt folgen';
    if (interactionType === 'user-follow') return 'Folgen';
    if (interactionType === 'collaboration') return 'Hilf uns!';
    if (interactionType === 'comment-send') return 'Senden';
    if (interactionType === 'share-opinion') return 'Teile Deine Erfahrung';
    if (interactionType === 'comment') return;
  };

  return (
    <Button
      onClick={onClick}
      variant="outlined"
      startIcon={getInteractionIcon()}
      sx={{
        mr: 2,
        px: 3,
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
