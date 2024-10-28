import Stack from '@mui/material/Stack';

import { CommentWithResponses } from '@/common/types';
import WriteCommentResponseCard from '@/components/common/comments/WriteCommentResponseCard';
import { NewsCommentCard } from '@/components/newsPage/cards/NewsCommentCard';
import { addUserComment } from '@/components/newsPage/threads/actions';

interface NewsCommentThreadProps {
  item: { id: string };
  comment: CommentWithResponses;
  commentType: 'NEWS_COMMENT' | 'POST_COMMENT';
  level: number;
  onDelete: () => void;
  onUpdate: (updatedComment: CommentWithResponses) => void;
}

export const NewsCommentThread = (props: NewsCommentThreadProps) => {
  const { comment, level } = props;

  const updateComment = (updatedText: string) => {
    props.onUpdate({ ...comment, comment: updatedText });
  };

  const handleDeleteResponse = (response: CommentWithResponses) => {
    const responses = comment.responses.filter((r) => r.id !== response.id);
    const updatedComment = { ...comment, responses };
    props.onUpdate(updatedComment);
  };

  const handleUpdateResponse = (response: CommentWithResponses) => {
    const idx = comment.responses.findIndex((r) => r.id === response.id);
    if (idx < 0) return;
    const updatedComment = comment;
    updatedComment.responses[idx] = response;
    props.onUpdate(updatedComment);
  };

  const handleResponse = async (response: string) => {
    const { data: newResponse } = await addUserComment({
      comment: response,
      commentType: props.commentType,
      objectId: props.item.id,
      parentCommentId: comment?.commentId,
    });

    if (!newResponse) return;

    const threadResponse = { ...newResponse, responseCount: 0, responses: [] };
    const responses = [threadResponse, ...comment.responses];
    const updatedComment = { ...comment, responses };
    props.onUpdate(updatedComment);
  };

  return (
    <>
      <NewsCommentCard
        comment={comment}
        commentType={props.commentType}
        displayResponseControls={level < 3}
        onDelete={props.onDelete}
        onUpdate={updateComment}
      />

      <WriteCommentResponseCard sx={{ mt: 2 }} comment={comment} onRespond={handleResponse} />

      <Stack sx={{ ml: 4, mt: 2 }} style={{ marginLeft: '2em' }}>
        {comment.responses &&
          comment.responses.map((response, idx) => (
            <NewsCommentThread
              key={idx}
              item={props.item}
              comment={response}
              commentType={props.commentType}
              level={level + 1}
              onDelete={() => handleDeleteResponse(response)}
              onUpdate={handleUpdateResponse}
            />
          ))}
      </Stack>
    </>
  );
};
