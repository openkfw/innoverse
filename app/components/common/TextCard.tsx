'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { User } from '@/common/types';
import { parseStringForLinks } from '@/components/common/LinkString';
import theme from '@/styles/theme';

import { TooltipContent } from '../project-details/TooltipContent';

import AvatarIcon from './AvatarIcon';
import { StyledTooltip } from './StyledTooltip';

import badgeIcon from '/public/images/icons/badge.svg';

interface TextCardProps {
  content: { author?: User; text: string };
  footer?: React.ReactNode;
  sx?: SxProps;
  headerSx?: SxProps;
}

const MAX_TEXT_LENGTH = 200;

export const TextCard = ({ content, footer, sx, headerSx }: TextCardProps) => {
  const { author, text } = content;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getText = () => {
    const slicedText = isCollapsed ? text : text.slice(0, MAX_TEXT_LENGTH);
    return parseStringForLinks(slicedText);
  };

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    if (text.length <= MAX_TEXT_LENGTH) {
      setIsCollapsed(true);
    }
  }, [text]);

  return (
    <Card sx={{ ...cardStyle, ...sx }}>
      {author && (
        <CardHeader
          sx={{ ...cardHeaderStyles, ...headerSx }}
          avatar={
            <Box>
              <StyledTooltip arrow key={author.id} title={<TooltipContent teamMember={author} />} placement="bottom">
                <AvatarIcon user={author} size={32} allowAnimation disableTransition />
              </StyledTooltip>
            </Box>
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
          <Box sx={{ ...textContainerStyle, overflowWrap: isCollapsed ? 'break-word' : 'unset' }}>
            <Typography variant="body1" sx={textStyle}>
              {getText()}
            </Typography>
            {!isCollapsed && (
              <Typography variant="subtitle2" onClick={handleToggle} sx={buttonOverlayStyle}>
                ... alles anzeigen
              </Typography>
            )}
          </Box>
          {footer}
        </Stack>
      </CardContent>
    </Card>
  );
};

// Text Card Styles

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

const cardHeaderTitleStyles = {
  fontSize: 14,
  fontWeight: '500',
  alignItems: 'center',
  justifyItems: 'center',
  marginLeft: '16px',
};

const cardContentStyles = {
  padding: 0,
  marginLeft: 5,
};

const textContainerStyle = {
  position: 'relative',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  whiteSpace: 'pre-wrap',
};

const textStyle = {
  color: 'secondary.contrastText',
};

const buttonOverlayStyle = {
  position: 'absolute',
  bottom: '0',
  right: '0',
  background: '#ffffff',
  color: theme.palette.primary.main,
  ':hover': {
    background: '#ffffff',
    color: theme.palette.primary.main,
  },
  fontSize: '14px',
  fontWeight: '500',
  marginBottom: '-1px',
  paddingLeft: '4px',
  cursor: 'pointer',
  boxShadow: '-10px 0 10px white',
};
