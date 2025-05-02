import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { CheckinQuestion } from '@/common/types';

import CheckinLineChart from './CheckinLineChart';

const CheckinQuestionVoteHistory = ({ questionsHistory }: { questionsHistory: CheckinQuestion[] }) => {
  return (
    <>
      {questionsHistory?.map((question, index) => (
        <Box key={index}>
          <Divider textAlign="left" />
          <Typography variant="body1" color="text.primary" sx={{ pt: 1 }}>
            {question.question}
          </Typography>
          {question.voteHistory?.length && question.userVoteHistory?.length && (
            <CheckinLineChart voteHistory={question.voteHistory} userVoteHistory={question.userVoteHistory} />
          )}
        </Box>
      ))}
    </>
  );
};

export default CheckinQuestionVoteHistory;
