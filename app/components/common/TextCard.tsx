'use client';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { parseStringForLinks } from '@/components/common/LinkString';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';
import { mergeStyles } from '@/utils/helpers';

interface TextCardProps {
  text: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sx?: SxProps;
  contentSx?: SxProps;
}

const MAX_TEXT_LENGTH = 200;

export const TextCard = ({ text, header, footer, sx, contentSx }: TextCardProps) => {
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
      {header}
      <CardContent sx={mergeStyles(cardContentStyles, contentSx)} style={{ paddingBottom: 0 }}>
        <Stack direction="column" spacing={2}>
          <Box sx={{ ...textContainerStyle, overflowWrap: isCollapsed ? 'break-word' : 'unset' }}>
            <Typography variant="body1" sx={textStyle}>
              {getText()}
            </Typography>
            {!isCollapsed && (
              <Typography variant="subtitle2" onClick={handleToggle} sx={buttonOverlayStyle}>
                {m.components_common_textCard_showAll()}
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
