import { useState } from 'react';

import Box from '@mui/material/Box';

import { NewsFeedEntry, ObjectType, ProjectUpdate } from '@/common/types';
import { NewsUpdateCard } from '@/components/newsPage/cards/NewsUpdateCard';
import { addUserComment } from '@/components/newsPage/threads/actions';
import { CommentThread } from '@/components/newsPage/threads/CommentThread';
import { NewsCommentThread } from '@/components/newsPage/threads/NewsCommentThread';
import { getCommentsByObjectId } from '@/utils/requests/comments/requests';

interface NewsUpdateThreadProps {
  entry: NewsFeedEntry;
}

export const NewsUpdateThread = (props: NewsUpdateThreadProps) => {
  const { entry } = props;
  const currentUpdate = entry.item as ProjectUpdate;
  const [update, setUpdate] = useState(currentUpdate);

  const handleUpdate = (updatedText: string) => {
    setUpdate({ ...update, comment: updatedText });
  };

  const fetchComments = async () => {
    const result = await getCommentsByObjectId({ objectId: update.id, objectType: ObjectType.UPDATE });
    return result.data;
  };

  const addComment = async (text: string) => {
    const comment = await addUserComment({
      comment: text,
      objectType: ObjectType.UPDATE,
      objectId: update.id,
      projectId: currentUpdate.projectId,
    });
    const data = comment.data ? { ...comment.data, comments: [] } : undefined;
    return { ...comment, data };
  };

  return (
    <CommentThread
      comment={update}
      card={<NewsUpdateCard entry={entry} onUpdate={handleUpdate} />}
      fetchComments={fetchComments}
      addComment={addComment}
      renderComment={(comment, idx, deleteComment, updateComment) => (
        <Box width="98%" display="block" alignSelf="end" key={`${idx}-${comment.id}`}>
          <NewsCommentThread
            key={`${idx}-${comment.id}`}
            item={update}
            comment={comment}
            commentType={ObjectType.UPDATE}
            level={1}
            onDelete={deleteComment}
            onUpdate={updateComment}
          />
        </Box>
      )}
    />
  );
};
