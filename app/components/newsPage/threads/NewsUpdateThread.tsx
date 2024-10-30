import { useState } from 'react';

import Box from '@mui/material/Box';

import { ObjectType, ProjectUpdate } from '@/common/types';
import { NewsUpdateCard } from '@/components/newsPage/cards/NewsUpdateCard';
import { addUserComment } from '@/components/newsPage/threads/actions';
import { CommentThread } from '@/components/newsPage/threads/CommentThread';
import { NewsCommentThread } from '@/components/newsPage/threads/NewsCommentThread';
import { getNewsCommentProjectUpdateId } from '@/utils/requests/comments/requests';

interface NewsUpdateThreadProps {
  update: ProjectUpdate;
  onDelete: () => void;
}

export const NewsUpdateThread = (props: NewsUpdateThreadProps) => {
  const [update, setUpdate] = useState(props.update);

  const handleUpdate = (updatedText: string) => {
    setUpdate({ ...update, comment: updatedText });
  };

  const fetchComments = async () => {
    return await getNewsCommentProjectUpdateId(update.id);
  };

  const addComment = async (text: string) => {
    const comment = await addUserComment({
      comment: text,
      commentType: 'NEWS_COMMENT',
      objectId: update.id,
      objectType: ObjectType.UPDATE,
    });
    const data = comment.data ? { ...comment.data, commentCount: 0, comments: [] } : undefined;

    return { ...comment, data: data };
  };

  return (
    <CommentThread
      comment={update}
      card={<NewsUpdateCard update={update} onDelete={props.onDelete} onUpdate={handleUpdate} />}
      fetchComments={fetchComments}
      addComment={addComment}
      renderComment={(comment, idx, deleteComment, updateComment) => (
        <Box width="98%" display="block " alignSelf="end" key={`${idx}-${comment.id}`}>
          <NewsCommentThread
            item={update}
            comment={comment}
            commentType="NEWS_COMMENT"
            level={1}
            onDelete={deleteComment}
            onUpdate={updateComment}
          />
        </Box>
      )}
    />
  );
};
