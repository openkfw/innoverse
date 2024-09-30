import Typography from '@mui/material/Typography';

import { useNewsFeed } from '@/app/contexts/news-feed-context';
import { CollaborationQuestion } from '@/common/types';
import { parseStringForLinks } from '@/components/common/LinkString';
import { highlightText } from '@/utils/highlightText';
interface NewsCollabQuestionCardProps {
  question: CollaborationQuestion;
}

function NewsCollabQuestionCard(props: NewsCollabQuestionCardProps) {
  const { question } = props;
  const { title, description } = question;
  const { filters } = useNewsFeed();
  const { searchString } = filters;

  return (
    <>
      <Typography variant="h5" color="secondary.contrastText" sx={titleStyles}>
        {highlightText(title, searchString)}
      </Typography>

      <Typography variant="body1" color="secondary.contrastText" sx={descriptionStyles} data-testid="text">
        {parseStringForLinks(description, searchString)}
      </Typography>
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
