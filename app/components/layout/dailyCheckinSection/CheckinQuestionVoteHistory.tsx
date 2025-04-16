import { CheckinQuestion } from '@/common/types';
import { Box, Divider, Typography } from '@mui/material';
import CheckinLineChart from './CheckinLineChart';

const CheckinQuestionVoteHistory = ({ voteHistory }: { voteHistory: CheckinQuestion[] }) => {
  return (
    <>
      {voteHistory?.map((question, index) => (
        <Box key={index}>
          <Divider textAlign="left" />
          <Typography variant="body1" color="text.primary" sx={{ pt: 1 }}>
            {question.question}
          </Typography>
          {question.voteHistory?.length ? <CheckinLineChart voteHistory={question.voteHistory} /> : <Box />}
        </Box>
      ))}
    </>
  );
};

export default CheckinQuestionVoteHistory;
