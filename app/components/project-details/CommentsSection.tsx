import { useState } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { CommentType } from '@/common/types';
import { projects_progression } from '@/repository/mock/project/project-page';

import { CommentCard } from '../collaboration/comments/CommentCard';
import WriteCommentCard from '../collaboration/WriteCommentCard';

const CommentsSection = () => {
  const project = projects_progression.projects[0];
  const [comments] = useState<CommentType[]>(project.comments);
  const [questions] = useState<string[]>(project.questions);
  const [newCommentText] = useState<string>(projects_progression.writeCommentText);

  const listStyle = {
    listStyleType: 'decimal',
    pl: 2,
    '& .MuiListItem-root': {
      display: 'list-item',
      fontFamily: '***FONT_REMOVED***',
      fontWeight: 700,
      pl: 0,
    },
  };

  return (
    <Stack spacing={3} sx={{ mt: 3, ml: 1, width: 622 }} direction="column">
      <Stack spacing={3}>
        <Typography variant="overline" color="primary.light">
          Deine Meinung ist gefragt
        </Typography>

        <List sx={listStyle}>
          {questions.map((question, i) => (
            <ListItem key={i}>
              <ListItemText
                primary={
                  <Typography variant="body1" color="text.primary" sx={{ fontWeight: 700 }}>
                    {question}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Stack>

      <Typography variant="caption" color="primary.main">
        {comments.length} Kommentare
      </Typography>
      <Stack sx={{ p: 0 }} spacing={3}>
        {comments.map((comment) => (
          <CommentCard content={comment} key={comment.id} />
        ))}
        <WriteCommentCard text={newCommentText} sx={{ width: '622px' }} />
      </Stack>
    </Stack>
  );
};

export default CommentsSection;
