import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { ProjectUpdate } from '@/common/types';

import { CommentCard } from './comments/CommentCard';
import { DateField } from './DateField';

interface UpdateCardProps {
  content: ProjectUpdate;
  divider: boolean;
}

export const UpdateCard = ({ content, divider }: UpdateCardProps) => {
  const { id, comment, author, date, projectStart } = content;
  const commentContent = { id, author, comment };
  const [day, month] = date.split(' ');
  const dayMonth = `${day} ${month}`;

  return (
    <Grid container>
      <Grid container item xs={3} justifyContent="flex-start" alignItems="center" direction="column">
        <DateField date={dayMonth} divider={divider} />

        {projectStart && (
          <Box sx={projectStartStyles}>
            <Typography variant="subtitle2" color="primary.main">
              Project Kickoff
            </Typography>
          </Box>
        )}
      </Grid>
      <Grid container item xs={7}>
        <CommentCard content={commentContent} sx={commentCardStyles} />
      </Grid>
    </Grid>
  );
};

// Update Card Styles

const projectStartStyles = {
  mt: 1,
  p: 1,
  background: 'rgba(0, 90, 140, 0.10)',
  borderRadius: '8px',
  width: 170,
  textAlign: 'center',
};

const commentCardStyles = {
  '.MuiCardHeader-root': {
    pt: 1,
  },
};
