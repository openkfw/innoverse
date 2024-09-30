import Stack from '@mui/material/Stack';

import { useUser } from '@/app/contexts/user-context';
import { CommentResponse } from '@/common/types';
import { useCollaborationCommentResponseCard } from '@/components/collaboration/comments/CollaborationCommentResponseCard';
import { CommentCardHeader } from '@/components/common/CommentCardHeader';
import { EditControls } from '@/components/common/editing/controls/EditControls';
import { useEditingInteractions, useEditingState } from '@/components/common/editing/editing-context';
import { TextCard } from '@/components/common/TextCard';
import { WriteCommentCard } from '@/components/newsPage/cards/common/WriteCommentCard';

interface NewsCollabCommentResponseCardProps {
  response: CommentResponse;
  onDelete: () => void;
}

export const NewsCollabCommentResponseCard = (props: NewsCollabCommentResponseCardProps) => {
  const { response, updateResponse, deleteResponse } = useCollaborationCommentResponseCard({
    onDelete: props.onDelete,
    response: props.response,
  });

  const state = useEditingState();
  const interactions = useEditingInteractions();
  const { user } = useUser();
  const userIsAuthor = user?.providerId === response.author.providerId;

  return state.isEditing(props.response) ? (
    <WriteCommentCard
      content={{
        author: response.author,
        comment: response.response,
        updatedAt: response.createdAt,
      }}
      onSubmit={updateResponse}
      onDiscard={interactions.onCancel}
    />
  ) : (
    <TextCard
      text={response.response}
      header={
        <CommentCardHeader content={{ author: response.author, updatedAt: response.createdAt }} avatar={{ size: 24 }} />
      }
      footer={
        <Stack direction={'row'} sx={{ mt: 0 }} style={{ marginTop: '8px', marginLeft: '-8px' }}>
          {userIsAuthor && <EditControls onEdit={() => interactions.onStart(response)} onDelete={deleteResponse} />}{' '}
        </Stack>
      }
      contentSx={{ marginLeft: 4 }}
    />
  );
};
