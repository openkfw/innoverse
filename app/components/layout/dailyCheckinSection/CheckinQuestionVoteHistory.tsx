import { CheckinQuestion } from '@/common/types';
import { Box, Divider, Typography } from '@mui/material';
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
          {question.voteHistory?.length && question.userVoteHistory?.length ? (
            <CheckinLineChart voteHistory={question.voteHistory} userVoteHistory={question.userVoteHistory} />
          ) : (
            <Box />
          )}
        </Box>
      ))}
    </>
  );
};

export default CheckinQuestionVoteHistory;
