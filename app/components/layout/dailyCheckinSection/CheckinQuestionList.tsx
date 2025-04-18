import { Box, Divider, Typography } from '@mui/material';
import Slider from '@mui/material/Slider';

import { CheckinQuestion } from '@/common/types';

const CheckinQuestionList = ({
  checkinQuestions,
  handleVoteChange,
}: {
  checkinQuestions: CheckinQuestion[];
  handleVoteChange: (questionId: string, value: number) => void;
}) => {
  return (
    <>
      {checkinQuestions?.map((question, index) => (
        <Box key={index}>
          <Divider textAlign="left" />
          <Typography variant="body1" color="text.primary" sx={{ pt: 1 }}>
            {question.question}
          </Typography>
          <Box sx={{ my: 2, px: 1 }}>
            <Slider
              step={1}
              marks={[...Array(5)].map((_, i) => ({ value: i + 1, label: i + 1 }))}
              min={1}
              max={5}
              size="medium"
              onChange={(event, newValue) => handleVoteChange(question.checkinQuestionId, newValue as number)}
            />
          </Box>
        </Box>
      ))}
    </>
  );
};

export default CheckinQuestionList;
