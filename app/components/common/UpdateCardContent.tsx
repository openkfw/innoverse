import Link from 'next/link';

import Typography from '@mui/material/Typography';

import { useNewsFeed } from '@/app/contexts/news-feed-context';
import { ProjectUpdate } from '@/common/types';
import CardContentWrapper from '@/components/common/CardContentWrapper';
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
  const { filters } = useNewsFeed();
  const { searchString } = filters;

  return (
    <CardContentWrapper>
      <Typography sx={noClamp ? subtitleStyles : null} color="text.primary" variant="body1" data-testid="text">
        {parseStringForLinks(comment, searchString)}
        {linkToCollaborationTab && (
          <Link style={linkStyles} href={`/projects/${projectId}?tab=1#moredetails`}>
            {' '}
            {m.components_common_updateCardText_knowMore()}
          </Link>
        )}
      </Typography>
    </CardContentWrapper>
  );
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
