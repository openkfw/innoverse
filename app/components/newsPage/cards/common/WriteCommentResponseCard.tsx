import { SxProps } from '@mui/material/styles';

import { useUser } from '@/app/contexts/user-context';
import { NewsComment, PostComment, UserSession } from '@/common/types';
import { useEditingInteractions, useEditingState } from '@/components/common/editing/editing-context';
import WriteTextCard from '@/components/common/editing/writeText/WriteTextCard';
import { addComment } from '@/services/commentService';

interface WriteCommentResponseCardProps {
  item: { id: string };
  commentType: 'NEWS_COMMENT' | 'POST_COMMENT';
  comment?: { id: string; commentId: string };
  sx?: SxProps;
  onResponse: (response: NewsComment | PostComment) => void;
}

export const WriteCommentResponseCard = ({
  item,
  commentType,
  comment,
  sx,
  onResponse,
}: WriteCommentResponseCardProps) => {
  const { user } = useUser();
  const interactions = useEditingInteractions();
  const state = useEditingState();

  const handleResponse = async (user: UserSession, text: string) => {
    const createdComment = await addComment({
      author: user,
      comment: text,
      commentType: commentType,
      objectId: item.id,
      parentCommentId: comment?.commentId,
    });
    interactions.onSubmitResponse();
    onResponse(createdComment);
  };

  return (
    user &&
    state.isResponding(comment ?? item) && <WriteTextCard sx={sx} onSubmit={(text) => handleResponse(user, text)} />
  );
};
