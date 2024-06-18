import { useState } from 'react';

import { ProjectUpdate } from '@/common/types';
import { ItemWithCommentsThread } from '@/components/newsPage/cards/common/threads/ItemWithCommentsThread';
import { NewsUpdateCard } from '@/components/newsPage/cards/UpdateCard';
import { getNewsCommentProjectUpdateId } from '@/utils/requests/comments/requests';

interface NewsUpdateThreadProps {
  update: ProjectUpdate;
  onDelete: () => void;
}

export const NewsUpdateThread = (props: NewsUpdateThreadProps) => {
  const [update, setUpdate] = useState(props.update);

  const fetchNewsComments = async () => {
    const responses = await getNewsCommentProjectUpdateId(update.id);
    return responses;
  };

  const handleUpdate = (updatedText: string) => {
    setUpdate({ ...update, comment: updatedText });
  };

  return (
    <ItemWithCommentsThread
      item={{ id: update.id, responseCount: update.responseCount ?? 0 }}
      card={<NewsUpdateCard update={update} onDelete={props.onDelete} onUpdate={handleUpdate} />}
      fetchResponses={fetchNewsComments}
      commentType="NEWS_COMMENT"
    />
  );
};
