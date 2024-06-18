import { useState } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Comment, Project, ProjectQuestion } from '@/common/types';
import { UnsavedEditingChangesDialog } from '@/components/common/editing/UnsavedChangesDialog';
import { sortDateByCreatedAt } from '@/utils/helpers';

import WriteTextCard from '../../common/editing/writeText/WriteTextCard';

import { addProjectComment } from './actions';
import { ProjectCommentCard } from './ProjectCommentCard';

const CommentsSection = ({ project }: { project: Project }) => {
  const [questions] = useState<ProjectQuestion[]>(project.questions);
  const [comments, setComments] = useState<Comment[]>(project.comments);

  const deleteComment = (comment: Comment) => {
    setComments((old) => old.filter((c) => c.id !== comment.id));
  };

  const addComment = async (comment: string) => {
    const { data: newComment } = await addProjectComment({ projectId: project.id, comment: comment });
    if (!newComment) return;
    setComments((comments) => sortDateByCreatedAt([...comments, newComment]));
  };

  return (
    <Stack sx={containerStyles} direction="column">
      <Stack>
        <Typography variant="overline" color="primary.light">
          Deine Meinung ist gefragt
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
        {comments.length} Kommentare
      </Typography>

      <Stack spacing={3}>
        {comments.map((comment) => (
          <ProjectCommentCard
            key={comment.id}
            comment={comment}
            projectName={project.title}
            onDelete={() => deleteComment(comment)}
          />
        ))}
        <WriteTextCard
          metadata={{ projectName: project.title }}
          onSubmit={addComment}
          sx={{ width: '622px', maxWidth: '100%' }}
        />
      </Stack>

      <UnsavedEditingChangesDialog />
    </Stack>
  );
};

export default CommentsSection;

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
    fontFamily: '***FONT_REMOVED***',
    fontWeight: 700,
    pl: 0,
  },
};
