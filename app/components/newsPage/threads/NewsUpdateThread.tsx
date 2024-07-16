import { useState } from 'react';

import { ProjectUpdate } from '@/common/types';
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

  const fetchResponses = async () => {
    return await getNewsCommentProjectUpdateId(update.id);
  };

  const addResponse = async (text: string) => {
    const response = await addUserComment({
      comment: text,
      commentType: 'NEWS_COMMENT',
      objectId: update.id,
    });
    const data = response.data ? { ...response.data, responseCount: 0, responses: [] } : undefined;
    return { ...response, data: data };
  };

  return (
    <CommentThread
      comment={{ id: update.id, responseCount: update.responseCount ?? 0 }}
      card={<NewsUpdateCard update={update} onDelete={props.onDelete} onUpdate={handleUpdate} />}
      fetchResponses={fetchResponses}
      addResponse={addResponse}
      renderResponse={(response, idx, deleteResponse, updateResponse) => (
        <NewsCommentThread
          key={`${idx}-${response.id}`}
          item={update}
          comment={response}
          commentType="NEWS_COMMENT"
          level={1}
          onDelete={deleteResponse}
          onUpdate={updateResponse}
        />
      )}
    />
  );
};
