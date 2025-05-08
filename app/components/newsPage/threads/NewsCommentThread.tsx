import Stack from '@mui/material/Stack';

import { CommentWithResponses, ObjectType } from '@/common/types';
import WriteCommentResponseCard from '@/components/common/comments/WriteCommentResponseCard';
import { NewsCommentCard } from '@/components/newsPage/cards/NewsCommentCard';
import { addUserComment } from '@/components/newsPage/threads/actions';

interface NewsCommentThreadProps {
  item: { id: string; objectType: ObjectType; projectId?: string };
  comment: CommentWithResponses;
  commentType: ObjectType;
  level: number;
  onDelete: () => void;
  onUpdate: (updatedComment: CommentWithResponses) => void;
}

export const NewsCommentThread = (props: NewsCommentThreadProps) => {
  const { comment, level } = props;
  const updateComment = (updatedText: string) => {
    props.onUpdate({ ...comment, text: updatedText });
  };

  const handleDeleteResponse = (responseId: string) => {
    const responses = comment.comments.filter((r) => r.id !== responseId);
    const updatedComment = { ...comment, comments: responses };
    props.onUpdate(updatedComment);
  };

  const handleUpdateResponse = (response: CommentWithResponses) => {
    const idx = comment.comments.findIndex((r) => r.id === response.id);
    if (idx < 0) return;
    const updatedComment = comment;
    updatedComment.comments[idx] = response;
    props.onUpdate(updatedComment);
  };

  const handleResponse = async (response: string) => {
    const { data: newResponse } = await addUserComment({
      comment: response,
      objectType: props.commentType,
      objectId: props.item.id,
      parentCommentId: comment?.id,
    });

    if (!newResponse) return;

    const threadResponse = { ...newResponse, comments: [] };
    const responses = [threadResponse, ...comment.comments];
    const updatedComment = { ...comment, comments: responses };
    props.onUpdate(updatedComment);
  };

  return (
    <>
      <NewsCommentCard
        comment={comment}
        objectType={props.commentType}
        displayResponseControls={level < 2}
        onDelete={props.onDelete}
        onUpdate={updateComment}
      />

      <WriteCommentResponseCard sx={{ mt: 2 }} comment={comment} onRespond={handleResponse} />

      <Stack sx={{ ml: 4, mt: 2 }} style={{ marginLeft: '2em' }}>
        {comment.comments &&
          comment.comments.map((response) => (
            <NewsCommentThread
              key={response.id}
              item={props.item}
              comment={response}
              commentType={props.commentType}
              level={level + 1}
              onDelete={() => handleDeleteResponse(response.id)}
              onUpdate={handleUpdateResponse}
            />
          ))}
      </Stack>
    </>
  );
};
