'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { Box, SxProps } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Comment } from '@/common/types';
import AvatarInitialsIcon from '@/components/common/AvatarInitialsIcon';
import { parseStringForLinks } from '@/components/common/LinkString';
import theme from '@/styles/theme';

import badgeIcon from '/public/images/icons/badge.svg';

interface CommentCardProps {
  content: Pick<Comment, 'author' | 'comment'>;
  voteComponent?: React.JSX.Element;
  sx?: SxProps;
  headerSx?: SxProps;
}

const MAX_TEXT_LENGTH = 300;

export const CommentCard = ({ content, voteComponent, sx, headerSx }: CommentCardProps) => {
  const { author, comment } = content;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    if (comment.length <= MAX_TEXT_LENGTH) {
      setIsCollapsed(true);
    }
  }, [comment]);

  return (
    <Card sx={{ ...cardStyle, ...sx }}>
      {author && (
        <CardHeader
          sx={{ ...cardHeaderStyles, ...headerSx }}
          avatar={
            author.image ? (
              <Avatar sx={avatarStyles}>
                <Image src={author.image} alt="avatar" fill sizes="33vw" />
              </Avatar>
            ) : (
              <AvatarInitialsIcon name={author.name} size={32} />
            )
          }
          title={
            <Stack direction="row" spacing={1} sx={cardHeaderTitleStyles}>
              <Typography variant="subtitle2" color="primary.dark">
                {author.name}
              </Typography>
              {author.badge && <Image src={badgeIcon} alt="badge" />}
              <Typography variant="subtitle2" color="text.secondary">
                {author.role}
              </Typography>
            </Stack>
          }
        />
      )}
      <CardContent sx={{ ...cardContentStyles }} style={{ paddingBottom: 0 }}>
        <Stack direction="column" spacing={2}>
          <Box sx={{ ...commentContainerStyles, WebkitLineClamp: isCollapsed ? '100' : '6' }}>
            <Typography variant="body1" sx={commentStyles}>
              {parseStringForLinks(comment)}
            </Typography>
            {!isCollapsed && (
              <Typography variant="subtitle2" onClick={handleToggle} sx={buttonOverlayStyle}>
                ... alles anzeigen
              </Typography>
            )}
          </Box>

          {voteComponent}
        </Stack>
      </CardContent>
    </Card>
  );
};

// Comment Card Styles

const cardStyle = {
  background: 'transparent',
  border: 'none',
  boxShadow: 'none',
  '.MuiCardHeader-root': {
    paddingLeft: 0,
  },
  '.MuiCardContent-root': {
    paddingLeft: 0,
  },
};

const cardHeaderStyles = {
  paddingBottom: '11px',
  paddingTop: 0,
  '& .MuiCardHeader-avatar': {
    marginRight: '8px',
  },
};

const avatarStyles = {
  width: 32,
  height: 32,
};

const cardHeaderTitleStyles = {
  fontSize: 14,
  fontWeight: '500',
  alignItems: 'center',
  justifyItems: 'center',
};

const cardContentStyles = {
  padding: 0,
  marginLeft: 5,
};

const commentContainerStyles = {
  position: 'relative',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  whiteSpace: 'pre-wrap',
};

const commentStyles = {
  color: 'secondary.contrastText',
};

const buttonOverlayStyle = {
  position: 'absolute',
  bottom: '0',
  right: '0',
  background: '#ffffff',
  color: theme.palette.secondary.main,
  ':hover': {
    background: '#ffffff',
    color: theme.palette.secondary.main,
  },
  fontSize: '14px',
  fontWeight: '500',
  marginBottom: '-1px',
  paddingLeft: '4px',
  cursor: 'pointer',
  boxShadow: '-10px 0 10px white',
};