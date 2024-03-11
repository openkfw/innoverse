import { useState } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Comment } from '@/common/types';
import { Project, ProjectQuestion } from '@/common/types';
import { sortDateByCreatedAt } from '@/utils/helpers';

import WriteCommentCard from '../../collaboration/writeComment/WriteCommentCard';
import { CommentCard } from '../../common/CommentCard';

import { handleComment, handleUpvotedBy, isCommentUpvotedBy } from './actions';
import { CommentVoteComponent } from './VoteComponent';

const CommentsSection = ({ project }: { project: Project }) => {
  const [questions] = useState<ProjectQuestion[]>(project.questions);
  const [comments, setComments] = useState<Comment[]>(project.comments);

  const handleSendComment = async (comment: string) => {
    const { data: newComment } = await handleComment({ projectId: project.id, comment: comment });
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
        {comments.map((comment, idx) => (
          <CommentCard
            key={idx}
            content={comment}
            voteComponent={
              <CommentVoteComponent
                commentId={comment.id}
                handleUpvote={handleUpvotedBy}
                isUpvoted={isCommentUpvotedBy}
                upvotedBy={comment.upvotedBy}
                handleClickOnResponse={() => {}}
              />
            }
          />
        ))}
        <WriteCommentCard
          projectName={project.title}
          sx={{ width: '622px', maxWidth: '100%' }}
          handleComment={handleSendComment}
        />
      </Stack>
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
