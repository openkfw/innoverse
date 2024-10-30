import { useState } from 'react';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import Typography from '@mui/material/Typography';

import { useUser } from '@/app/contexts/user-context';
import { CollaborationComment, NewsFeedEntry } from '@/common/types';
import { updateProjectCollaborationComment } from '@/components/collaboration/comments/actions';
import CardContentWrapper from '@/components/common/CardContentWrapper';
import { CommentCardHeader } from '@/components/common/CommentCardHeader';
import { errorMessage } from '@/components/common/CustomToast';
import {
  useEditingInteractions,
  useEditingState,
  useRespondingInteractions,
} from '@/components/common/editing/editing-context';
import { WriteCommentCard } from '@/components/newsPage/cards/common/WriteCommentCard';
import * as m from '@/src/paraglide/messages.js';
import { HighlightText } from '@/utils/highlightText';
import { appInsights } from '@/utils/instrumentation/AppInsights';

import CommentOverview from './common/CommentOverview';
import { NewsCardActions } from './common/NewsCardActions';

interface NewsCollabCommentCardProps {
  entry: NewsFeedEntry;
}

function NewsCollabCommentCard(props: NewsCollabCommentCardProps) {
  const { comment, question, isEditing, cancelEditing, handleUpdate } = useNewsCollabCommentCard(props);

  return isEditing ? (
    <WriteCommentCard
      content={{ author: comment.author, comment: comment.comment, updatedAt: comment.updatedAt }}
      onSubmit={handleUpdate}
      onDiscard={cancelEditing}
    />
  ) : (
    <>
      <CommentOverview title={question.title} description={question.description} projectId={comment.projectId} />
      <CommentCardHeader content={comment} avatar={{ size: 32 }} />
      <CardContentWrapper>
        <Typography color="text.primary" variant="body1">
          <HighlightText text={comment.comment} />
        </Typography>
      </CardContentWrapper>
      <NewsCardActions entry={props.entry} />
    </>
  );
}

function useNewsCollabCommentCard(props: NewsCollabCommentCardProps) {
  const { entry } = props;
  const item = entry.item as CollaborationComment;
  const question = item.question;

  const [comment, setComment] = useState(item);

  const state = useEditingState();
  const editingInteractions = useEditingInteractions();
  const respondingInteractions = useRespondingInteractions();
  const { user } = useUser();
  const userIsAuthor = comment.author.providerId === user?.providerId;

  const handleUpdate = async (updatedText: string) => {
    try {
      await updateProjectCollaborationComment({ commentId: comment.id, updatedText });
      setComment({ ...comment, comment: updatedText });
      editingInteractions.onSubmit();
    } catch (error) {
      console.error('Error updating collaboration comment:', error);
      errorMessage({ message: m.components_collaboration_comments_collaborationCommentCard_updateError() });
      appInsights.trackException({
        exception: new Error('Failed to update collaboration comment', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  return {
    comment,
    question,
    displayEditingControls: userIsAuthor,
    isEditing: state.isEditing(comment),
    startEditing: () => editingInteractions.onStart(comment),
    startResponse: () => respondingInteractions.onStart(comment),
    cancelEditing: editingInteractions.onCancel,
    handleUpdate,
  };
}

export default NewsCollabCommentCard;
