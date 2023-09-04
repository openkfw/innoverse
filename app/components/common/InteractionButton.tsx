import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import Button, { ButtonProps } from '@mui/material/Button';

interface InteractionButtonProps extends ButtonProps {
  interactionType: InterfactionType;
  label?: string;
}

type InterfactionType = 'like' | 'project-follow' | 'user-follow' | 'collaboration' | 'comment';

export default function InteractionButton(props: InteractionButtonProps) {
  const { interactionType, label } = props;

  const getInteractionIcon = () => {
    if (interactionType === 'like') return <ThumbUpOutlinedIcon fontSize="small" />;
    if (interactionType === 'project-follow') return <BookmarkAddOutlinedIcon fontSize="small" />;
    if (interactionType === 'user-follow') return <PersonAddIcon fontSize="small" />;
    if (interactionType === 'collaboration') return <PeopleOutlineOutlinedIcon fontSize="small" />;
    if (interactionType === 'comment') return <ChatBubbleOutlineOutlinedIcon />;
  };

  const getButtontext = () => {
    if (label) return label;
    if (interactionType === 'like') return 'Like';
    if (interactionType === 'project-follow') return 'Projekt Folgen';
    if (interactionType === 'user-follow') return 'Folgen';
    if (interactionType === 'collaboration') return 'Zusammenarbeit Öffnen';
    if (interactionType === 'comment') return;
  };

  return (
    <Button
      variant="outlined"
      startIcon={getInteractionIcon()}
      sx={{
        color: 'rgba(0, 0, 0, 0.56)',
        mt: '20px',
        mr: '15px',
        borderRadius: '48px',
        fontFamily: 'Arial',
        fontSize: '13px',
        fontWeight: '700',
        lineHeight: '19px',
        border: ' 1px solid rgba(0, 0, 0, 0.10)',
        background: 'rgba(255, 255, 255, 0.10)',
        '&:hover': {
          border: '2px solid rgba(255, 255, 255, 0.40)',
          background: 'secondary.main',
        },
        '&:active': {
          border: '2px solid rgba(255, 255, 255, 0.40)',
          background: 'palette.secondary.main',
        },
      }}
    >
      {getButtontext()}
    </Button>
  );
}
