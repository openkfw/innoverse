import { useState } from 'react';

import Box from '@mui/material/Box';

import { NewsFeedEntry, ProjectUpdate } from '@/common/types';
import { NewsUpdateCard } from '@/components/newsPage/cards/NewsUpdateCard';
import { addUserComment } from '@/components/newsPage/threads/actions';
import { CommentThread } from '@/components/newsPage/threads/CommentThread';
import { NewsCommentThread } from '@/components/newsPage/threads/NewsCommentThread';
import { getCommentByObjectId } from '@/utils/requests/comments/requests';

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

  const fetchResponses = async () => {
    return await getCommentByObjectId(update.id);
  };

  const addResponse = async (text: string) => {
    const response = await addUserComment({
      comment: text,
      objectType: 'UPDATE',
      objectId: update.id,
    });
    const data = response.data ? { ...response.data, responseCount: 0, responses: [] } : undefined;
    return { ...response, data };
  };

  return (
    <CommentThread
      comment={{ id: update.id, responseCount: update.responseCount ?? 0 }}
      card={<NewsUpdateCard entry={entry} onUpdate={handleUpdate} />}
      fetchResponses={fetchResponses}
      addResponse={addResponse}
      renderResponse={(response, idx, deleteResponse, updateResponse) => (
        <Box width="98%" display="block" alignSelf="end">
          <NewsCommentThread
            key={`${idx}-${response.id}`}
            item={update}
            comment={response}
            commentType="UPDATE"
            level={1}
            onDelete={deleteResponse}
            onUpdate={updateResponse}
          />
        </Box>
      )}
    />
  );
};
