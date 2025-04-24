import { useState } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { CommentWithResponses, ObjectType, Project, ProjectQuestion } from '@/common/types';
import NewsItemThread from '@/components/newsPage/threads/NewsItemThread';
import * as m from '@/src/paraglide/messages.js';

function countComments(comments: CommentWithResponses[] = []): number {
  return comments.reduce((total, comment) => {
    const replies = comment.comments || [];
    return total + 1 + countComments(replies);
  }, 0);
}

const ProjectCommentsSection = ({ project }: { project: Project }) => {
  const [questions] = useState<ProjectQuestion[]>(project.questions);
  const commentCount = countComments(project.comments);

  return (
    <Stack sx={containerStyles} direction="column">
      <Stack>
        <Typography variant="overline" color="primary.light">
          {m.components_projectdetails_comments_commentsSection_opinion()}
        </Typography>

        <List sx={listStyle}>
          {questions.map((question, i) => (
            <ListItem key={i}>
              <ListItemText
                primary={
                  <Typography variant="body1" color="text.primary" sx={{ fontWeight: 700 }}>
                    {question.title}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ marginTop: 1, marginBottom: 3 }}>
        {commentCount} {m.components_projectdetails_comments_commentsSection_comments()}
      </Typography>

      <Stack spacing={3}>
        <NewsItemThread
          entry={{
            item: project,
            type: ObjectType.PROJECT,
          }}
          enableEditing={true}
        />
      </Stack>
    </Stack>
  );
};

export default ProjectCommentsSection;

// Comment  Section Styles

const containerStyles = {
  mt: 3,
  ml: 1,
};

const listStyle = {
  listStyleType: 'decimal',
  pl: 2,
  '& .MuiListItem-root': {
    display: 'list-item',
    fontFamily: 'SlabReg',
    fontWeight: 700,
    pl: 0,
  },
};
