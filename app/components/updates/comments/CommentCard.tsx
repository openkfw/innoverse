import { useEffect, useState } from 'react';
import Image from 'next/image';

import { SxProps } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { CommentType } from '@/common/types';
import theme from '@/styles/theme';

import badgeIcon from '/public/images/icons/badge.svg';

interface CommentCardProps {
  content: CommentType;
  sx?: SxProps;
}

const MAX_TEXT_LENGTH = 300;

export const CommentCard = ({ content, sx }: CommentCardProps) => {
  const { author, comment } = content;
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
    ...sx,
  };

  return (
    <Card sx={cardStyle}>
      <CardHeader
        avatar={
          <Avatar sx={{ width: 32, height: 32 }}>
            <Image src={avatar} alt="avatar" fill sizes="33vw" />
          </Avatar>
        }
        title={
          <Stack
            direction="row"
            spacing={1}
            sx={{
              fontSize: 14,
              fontWeight: '500',
              alignItems: 'center',
              justifyItems: 'center',
            }}
          >
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
      <CardContent sx={{ pt: 0, ml: 6 }}>
        <Stack direction="column" spacing={1}>
          <>
            {isCollapsed ? (
              <Collapse in={isCollapsed}>
                <Typography variant="body1" sx={{ color: 'secondary.contrastText' }}>
                  {comment}
                </Typography>
              </Collapse>
            ) : (
              <>
                <Typography variant="body1" sx={{ color: 'secondary.contrastText' }}>
                  {comment.slice(0, MAX_TEXT_LENGTH)}...
                  <Button size="small" onClick={handleToggle} sx={buttonStyle}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      alles anzeigen
                    </Typography>
                  </Button>
                </Typography>
              </>
            )}
          </>
        </Stack>
      </CardContent>
    </Card>
  );
};
