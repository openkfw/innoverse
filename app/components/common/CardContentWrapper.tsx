import { PropsWithChildren } from 'react';

import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';

export default function CardContentWrapper({ children }: PropsWithChildren) {
  return (
    <CardContent sx={cardContentStyles}>
      <Box sx={titleWrapperStyles}>{children}</Box>
    </CardContent>
  );
}

const cardContentStyles = {
  paddingTop: 0,
  padding: 0,
  margin: 0,
  textAlign: 'left',
  wordBreak: 'break-word',
};

const titleWrapperStyles = {
  marginTop: 10 / 8,
  marginBotom: 10 / 8,
};
