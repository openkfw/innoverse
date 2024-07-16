import Typography from '@mui/material/Typography';

import { CollaborationQuestion } from '@/common/types';
import { parseStringForLinks } from '@/components/common/LinkString';
interface NewsCollabQuestionCardProps {
  question: CollaborationQuestion;
}

function NewsCollabQuestionCard(props: NewsCollabQuestionCardProps) {
  const { question } = props;
  const { title, description } = question;

  return (
    <>
      <Typography variant="h5" color="secondary.contrastText" sx={titleStyles}>
        {title}
      </Typography>

      <Typography variant="body1" color="secondary.contrastText" sx={descriptionStyles} data-testid="text">
        {parseStringForLinks(description)}
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
