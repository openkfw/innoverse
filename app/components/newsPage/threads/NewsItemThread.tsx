import { NewsFeedEntry } from '@/common/types';
import { CommentThread } from '@/components/newsPage/threads/CommentThread';
import { NewsCommentThread } from '@/components/newsPage/threads/NewsCommentThread';

interface NewsItemThreadProps {
  entry: NewsFeedEntry;
  Card?: React.ElementType<{ entry: NewsFeedEntry }>;
}

const NewsItemThread = ({ entry, Card }: NewsItemThreadProps) => {
  return (
    <CommentThread
      item={entry.item}
      itemType={entry.type}
      card={Card ? <Card entry={entry} /> : <></>}
      renderComment={(comment, idx, deleteComment, updateComment) => (
        <NewsCommentThread
          key={`${idx}-${comment.id}`}
          item={entry.item}
          comment={comment}
          commentType={entry.type}
          level={1}
          onDelete={deleteComment}
          onUpdate={updateComment}
        />
      )}
    />
  );
};

export default NewsItemThread;
