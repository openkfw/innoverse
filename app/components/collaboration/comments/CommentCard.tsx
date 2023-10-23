import { useEffect, useState } from 'react';
import Image from 'next/image';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { CommentType } from '@/common/types';
import AvatarInitialsIcon from '@/components/common/AvatarInitialsIcon';
import theme from '@/styles/theme';

import { VoteComponent } from '../VoteComponent';

import badgeIcon from '/public/images/icons/badge.svg';

interface CommentCardProps {
  content: CommentType;
}

const MAX_TEXT_LENGTH = 300;

export const CommentCard = ({ content }: CommentCardProps) => {
  const { author, comment, upvotes } = content;
  const { name, role, avatar, badge } = author;

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
    <Card sx={cardStyle}>
      <CardHeader
        sx={cardHeaderStyles}
        avatar={
          avatar ? (
            <Avatar sx={avatarStyles}>
              <Image src={avatar} alt="avatar" fill sizes="33vw" />
            </Avatar>
          ) : (
            <AvatarInitialsIcon name={name} size={32} />
          )
        }
        title={
          <Stack direction="row" spacing={1} sx={cardHeaderTitleStyles}>
            <Typography variant="subtitle2" color="secondary.contrastText">
              {name}
            </Typography>
            {badge && <Image src={badgeIcon} alt="badge" />}
            <Typography variant="subtitle2" color="text.secondary">
              {role}
            </Typography>
          </Stack>
        }
      />
      <CardContent sx={cardContentStyles}>
        <Stack direction="column" spacing={2}>
          <>
            {isCollapsed ? (
              <Collapse in={isCollapsed}>
                <Typography variant="body1" sx={{ color: 'secondary.contrastText', marginTop: 2 }}>
                  {comment}
                </Typography>
              </Collapse>
            ) : (
              <>
                <Typography variant="body1" sx={{ color: 'secondary.contrastText' }}>
                  {comment.slice(0, MAX_TEXT_LENGTH)}...
                  <Button size="small" onClick={handleToggle} sx={buttonStyle}>
                    <Typography variant="subtitle2" sx={{ fontSize: '14px', fontWeight: '500' }}>
                      alles anzeigen
                    </Typography>
                  </Button>
                </Typography>
              </>
            )}
          </>

          <VoteComponent upvotes={upvotes} />
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
  margin: 0,
  padding: 0,
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
  paddingTop: 0,
  marginLeft: 6,
  marginBottom: 1,
};

const buttonStyle = {
  p: 0,
  pl: 1,
  background: 'transparent',
  color: theme.palette.secondary.main,
  ':hover': {
    background: 'transparent',
    color: theme.palette.secondary.main,
  },
};
