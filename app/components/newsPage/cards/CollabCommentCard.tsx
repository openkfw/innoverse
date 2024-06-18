import { useState } from 'react';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { CollaborationComment } from '@/common/types';
import { addProjectCollaborationComment } from '@/components/collaboration/comments/actions';
import { CollaborationCommentThread } from '@/components/collaboration/comments/CollaborationCommentThread';
import { errorMessage } from '@/components/common/CustomToast';
import WriteTextCard from '@/components/common/editing/writeText/WriteTextCard';
import { TransparentButton } from '@/components/common/TransparentButton';
import ReplyIcon from '@/components/icons/ReplyIcon';
import { sortDateByCreatedAt } from '@/utils/helpers';
import { appInsights } from '@/utils/instrumentation/AppInsights';

import CommentOverview from './common/CommentOverview';

interface NewsCollabCommentCardProps {
  item: CollaborationComment;
}

function NewsCollabCommentCard(props: NewsCollabCommentCardProps) {
  const { item } = props;
  const { projectId, question } = item;
  const projectName = projectId; // todo - project name instead of id
  const [comments, setComments] = useState(question?.comments);
  const [writeNewComment, setWriteNewComment] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleComment = async (comment: string) => {
    try {
      const { data: newComment } = await addProjectCollaborationComment({
        projectId,
        questionId: question.id,
        comment,
      });
      if (!newComment) {
        console.error('No comment was returned by the server.');
        errorMessage({ message: 'Failed to post the comment. Please try again.' });
        appInsights.trackException({
          exception: new Error('Failed to post the comment.'),
          severityLevel: SeverityLevel.Error,
        });
        return;
      }
      const newComments = sortDateByCreatedAt([...comments, newComment]);
      setComments(newComments);
    } catch (error) {
      console.error('Failed to submit comment:', error);
      errorMessage({ message: 'Failed to submit your comment. Please try again.' });
      appInsights.trackException({
        exception: new Error('Failed to submit comment.'),
        severityLevel: SeverityLevel.Error,
      });
    } finally {
      setWriteNewComment(false);
    }
  };

  return (
    <>
      <CommentOverview title={question.title} description={question.description} />
      {writeNewComment ? (
        <WriteTextCard onSubmit={handleComment} metadata={{ projectName }} sx={{ marginBottom: 2 }} />
      ) : (
        <Button variant="outlined" onClick={() => setWriteNewComment(true)} startIcon={<ReplyIcon />} sx={buttonStyle}>
          <Typography variant="subtitle2" sx={typographyStyles}>
            antworten
          </Typography>
        </Button>
      )}

      {!showAll && (
        <TransparentButton
          onClick={() => setShowAll(true)}
          startIcon={<AddIcon color="secondary" fontSize="large" />}
          style={{ marginTop: '1em', marginLeft: '1.5em', marginBottom: 2 }}
        >
          Kommentare anzeigen ({question?.comments.length})
        </TransparentButton>
      )}

      {showAll &&
        comments.map((comment, idx) => (
          <CollaborationCommentThread
            key={idx}
            comment={comment}
            onDeleteComment={() => setComments((prev) => prev.filter((c) => c.id !== comment.id))}
          />
        ))}
    </>
  );
}

export default NewsCollabCommentCard;

// News Collab Question Card Styles
const typographyStyles = {
  color: 'rgba(0, 0, 0, 0.56)',
  fontSize: 13,
  fontWeight: 700,
};

const buttonStyle = {
  width: 'fit-content',
  color: 'rgba(0, 0, 0, 0.56)',
  borderColor: 'transparent',
  borderRadius: '48px',
  fontSize: '13px',
  fontWeight: '700',
  lineHeight: '19px',
  background: 'rgba(255, 255, 255, 0.10)',
  height: '32px',
  '&:hover': { backgroundColor: 'secondary.main', borderColor: '#D4FCCA' },
  '&:active': { backgroundColor: 'secondary.main' },
};
