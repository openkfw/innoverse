import { SurveyQuestion } from '@/common/types';
import { SurveyCard } from '@/components/collaboration/survey/SurveyCard';

interface NewsSurveyCardProps {
  projectId?: string;
  surveyQuestion: SurveyQuestion;
}

function NewsSurveyCard(props: NewsSurveyCardProps) {
  const { surveyQuestion, projectId = '' } = props;

  return <SurveyCard surveyQuestion={surveyQuestion} projectId={projectId} sx={surveyStyles} fill />;
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
