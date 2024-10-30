import { NewsFeedEntry, SurveyQuestion } from '@/common/types';
import { SurveyCard } from '@/components/collaboration/survey/SurveyCard';

import { NewsCardActions } from './common/NewsCardActions';

interface NewsSurveyCardProps {
  entry: NewsFeedEntry;
}

function NewsSurveyCard({ entry }: NewsSurveyCardProps) {
  const surveyQuestion = entry.item as SurveyQuestion;

  return (
    <>
      <SurveyCard surveyQuestion={surveyQuestion} projectId={surveyQuestion.projectId} sx={surveyStyles} fill />
      <NewsCardActions entry={entry} hideControls />
    </>
  );
}

export default NewsSurveyCard;

// News Survey Card Styles
const surveyStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 2,
  wordBreak: 'break-word',
  borderRadius: 100,
};
