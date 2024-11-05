import Typography from '@mui/material/Typography';

import { CollaborationQuestion, NewsFeedEntry } from '@/common/types';
import { parseStringForLinks } from '@/components/common/LinkString';
import { HighlightText } from '@/utils/highlightText';

import { NewsCardActions } from './common/NewsCardActions';

interface NewsCollabQuestionCardProps {
  entry: NewsFeedEntry;
}

function NewsCollabQuestionCard(props: NewsCollabQuestionCardProps) {
  const { entry } = props;
  const question = entry.item as CollaborationQuestion;
  const { title, description } = question;

  return (
    <>
      <Typography variant="h5" color="secondary.contrastText" sx={titleStyles}>
        <HighlightText text={title} />
      </Typography>

      <Typography variant="body1" color="secondary.contrastText" sx={descriptionStyles} data-testid="text">
        {parseStringForLinks(description)}
      </Typography>

      <NewsCardActions entry={entry} hideControls />
    </>
  );
}

export default NewsCollabQuestionCard;

// News Collab Question Card Styles
const titleStyles = {
  marginBottom: 2,
  wordBreak: 'break-word',
};

const descriptionStyles = {
  wordBreak: 'break-word',
};
