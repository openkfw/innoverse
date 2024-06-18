import { useState } from 'react';

import Stack from '@mui/material/Stack';

import { CommentWithResponses, NewsComment, PostComment } from '@/common/types';
import { useEditingInteractions } from '@/components/common/editing/editing-context';
import { WriteCommentResponseCard } from '@/components/newsPage/cards/common/WriteCommentResponseCard';
import { NewsCommentCard } from '@/components/newsPage/cards/NewsCommentCard';

interface NewsCommentThreadProps {
  item: { id: string };
  comment: CommentWithResponses;
  commentType: 'NEWS_COMMENT' | 'POST_COMMENT';
  onDelete: () => void;
}

export const NewsCommentThread = (props: NewsCommentThreadProps) => {
  const [comment, setComment] = useState<CommentWithResponses>(props.comment);
  const interactions = useEditingInteractions();

  const handleResponse = (response: NewsComment | PostComment) => {
    const newResponse: CommentWithResponses = { ...response, responses: [] };
    setComment({ ...comment, responses: [...comment.responses, newResponse] });
    interactions.onSubmitResponse();
  };

  const handleDelete = (response: CommentWithResponses) => {
    const responses = comment.responses.filter((r) => r.id !== response.id);
    setComment({ ...comment, responses });
  };

  const handleUpdate = (updatedText: string) => {
    setComment({ ...comment, comment: updatedText });
  };

  return (
    <>
      <NewsCommentCard
        comment={comment}
        commentType={props.commentType}
        onDelete={props.onDelete}
        onUpdate={handleUpdate}
      />

      <WriteCommentResponseCard
        sx={{ mt: 2 }}
        commentType={props.commentType}
        item={props.item}
        comment={props.comment}
        onResponse={handleResponse}
      />

      <Stack sx={{ ml: 5, mt: 2 }} style={{ marginLeft: '2em' }}>
        {comment.responses.map((response, idx) => (
          <NewsCommentThread
            key={idx}
            comment={response}
            item={props.item}
            commentType={props.commentType}
            onDelete={() => handleDelete(response)}
          />
        ))}
      </Stack>
    </>
  );
};
