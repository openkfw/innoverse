import Link from 'next/link';

import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { ProjectUpdate } from '@/common/types';
import { parseStringForLinks } from '@/components/common/LinkString';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

interface UpdateCardContentProps {
  update: ProjectUpdate;
  noClamp?: boolean;
}

export const UpdateCardContent = (props: UpdateCardContentProps) => {
  const { update, noClamp = false } = props;
  const { comment, projectId, linkToCollaborationTab } = update;

  return (
    <CardContent sx={cardContentStyles}>
      <Box sx={titleWrapperStyles}>
        <Typography sx={noClamp ? subtitleStyles : null} color="text.primary" variant="body1" data-testid="text">
          {parseStringForLinks(comment)}
          {linkToCollaborationTab && (
            <Link style={linkStyles} href={`/projects/${projectId}?tab=1#moredetails`}>
              {' '}
              {m.components_common_updateCardText_knowMore()}
            </Link>
          )}
        </Typography>
      </Box>
    </CardContent>
  );
};

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

const subtitleStyles = {
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
};

const linkStyles = {
  textDecoration: 'none',
  cursor: 'pointer',
  color: theme.palette.primary.main,
};
