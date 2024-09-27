import { useState } from 'react';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import Typography from '@mui/material/Typography';

import { useUser } from '@/app/contexts/user-context';
import { CollaborationComment } from '@/common/types';
import {
  deleteProjectCollaborationComment,
  updateProjectCollaborationComment,
} from '@/components/collaboration/comments/actions';
import CardContentWrapper from '@/components/common/CardContentWrapper';
import { CommentCardHeader } from '@/components/common/CommentCardHeader';
import { errorMessage } from '@/components/common/CustomToast';
import { EditControls } from '@/components/common/editing/controls/EditControls';
import { ResponseControls } from '@/components/common/editing/controls/ResponseControl';
import { useEditingInteractions, useEditingState } from '@/components/common/editing/editing-context';
import { NewsCardControls } from '@/components/newsPage/cards/common/NewsCardControls';
import { WriteCommentCard } from '@/components/newsPage/cards/common/WriteCommentCard';
import * as m from '@/src/paraglide/messages.js';
import { appInsights } from '@/utils/instrumentation/AppInsights';
import { formatMentionToText } from '@/utils/mentions/formatMentionToText';

import CommentOverview from './common/CommentOverview';

interface NewsCollabCommentCardProps {
  item: CollaborationComment;
  onDelete: () => void;
}

function NewsCollabCommentCard(props: NewsCollabCommentCardProps) {
  const {
    comment,
    question,
    displayEditingControls,
    isEditing,
    startEditing,
    startResponse,
    cancelEditing,
    handleUpdate,
    handleDelete,
  } = useNewsCollabCommentCard(props);

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
          {formatMentionToText(comment.comment)}
        </Typography>
      </CardContentWrapper>
      <NewsCardControls>
        {displayEditingControls && <EditControls onEdit={startEditing} onDelete={handleDelete} />}
        <ResponseControls onResponse={startResponse} />
      </NewsCardControls>
    </>
  );
}

function useNewsCollabCommentCard(props: NewsCollabCommentCardProps) {
  const { item, onDelete } = props;
  const question = item.question;

  const [comment, setComment] = useState(item);

  const state = useEditingState();
  const interactions = useEditingInteractions();
  const { user } = useUser();
  const userIsAuthor = comment.author.providerId === user?.providerId;

  const handleUpdate = async (updatedText: string) => {
    try {
      await updateProjectCollaborationComment({ commentId: comment.id, updatedText });
      setComment({ ...comment, comment: updatedText });
      interactions.onSubmitEdit();
    } catch (error) {
      console.error('Error updating collaboration comment:', error);
      errorMessage({ message: m.components_collaboration_comments_collaborationCommentCard_updateError() });
      appInsights.trackException({
        exception: new Error('Failed to update collaboration comment', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const handleDelete = () => {
    try {
      deleteProjectCollaborationComment({ commentId: comment.id });
      onDelete();
    } catch (error) {
      console.error('Error deleting collaboration comment:', error);
      errorMessage({ message: m.components_collaboration_comments_collaborationCommentCard_deleteError() });
      appInsights.trackException({
        exception: new Error('Failed to delete collaboration comment.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  return {
    comment,
    question,
    displayEditingControls: userIsAuthor,
    isEditing: state.isEditing(comment),
    startEditing: () => interactions.onStartEdit(comment),
    startResponse: () => interactions.onStartResponse(comment),
    cancelEditing: (params: { isDirty: boolean }) => interactions.onCancelEdit(params),
    handleUpdate,
    handleDelete,
  };
}

export default NewsCollabCommentCard;
