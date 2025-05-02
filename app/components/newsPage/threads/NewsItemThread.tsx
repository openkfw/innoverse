import { NewsFeedEntry } from '@/common/types';
import { CommentThread } from '@/components/newsPage/threads/CommentThread';
import { NewsCommentThread } from '@/components/newsPage/threads/NewsCommentThread';

interface NewsItemThreadProps {
  entry: NewsFeedEntry;
  Card?: React.ElementType<{ entry: NewsFeedEntry }>;
  enableCommenting?: boolean;
  maxNumberOfComments?: number;
  disableDivider?: boolean;
  showCommentCount?: boolean;
}

const NewsItemThread = ({
  entry,
  Card,
  enableCommenting = false,
  showCommentCount = false,
  maxNumberOfComments = 0,
  disableDivider,
}: NewsItemThreadProps) => {
  return (
    <CommentThread
      item={entry.item}
      itemType={entry.type}
      card={Card ? <Card entry={entry} /> : <></>}
      enableCommenting={enableCommenting}
      disableDivider={disableDivider}
      showCommentCount={showCommentCount}
      maxNumberOfComments={maxNumberOfComments}
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
