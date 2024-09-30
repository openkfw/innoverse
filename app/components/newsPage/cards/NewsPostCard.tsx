import { useState } from 'react';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import Typography from '@mui/material/Typography';

import { useNewsFeed } from '@/app/contexts/news-feed-context';
import { useUser } from '@/app/contexts/user-context';
import { Post, UserSession } from '@/common/types';
import CardContentWrapper from '@/components/common/CardContentWrapper';
import { CommentCardHeader } from '@/components/common/CommentCardHeader';
import { errorMessage } from '@/components/common/CustomToast';
import { EditControls } from '@/components/common/editing/controls/EditControls';
import { ResponseControls } from '@/components/common/editing/controls/ResponseControl';
import { useEditingInteractions, useEditingState } from '@/components/common/editing/editing-context';
import { parseStringForLinks } from '@/components/common/LinkString';
import { NewsCardControls } from '@/components/newsPage/cards/common/NewsCardControls';
import { WriteCommentCard } from '@/components/newsPage/cards/common/WriteCommentCard';
import { deletePost, updatePost } from '@/services/postService';
import * as m from '@/src/paraglide/messages.js';
import { appInsights } from '@/utils/instrumentation/AppInsights';

interface NewsPostCardProps {
  post: Post;
  onDelete: () => void;
}
function NewsPostCard(props: NewsPostCardProps) {
  const { onDelete } = props;
  const { filters } = useNewsFeed();
  const { searchString } = filters;

  const [post, setPost] = useState(props.post);

  const state = useEditingState();
  const interactions = useEditingInteractions();
  const { user } = useUser();
  const userIsAuthor = user?.providerId === post.author?.providerId;

  const handleUpdate = async (updatedText: string, user?: UserSession) => {
    try {
      if (user) {
        updatePost({ postId: post.id, content: updatedText, user });
        setPost({ ...post, content: updatedText });
        interactions.onSubmitEdit();
      }
    } catch (error) {
      console.error('Error updating post:', error);
      errorMessage({ message: m.components_newsPage_cards_newsCard_error_update() });
      appInsights.trackException({
        exception: new Error('Failed to update post', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost({ postId: post.id });
      onDelete();
    } catch (error) {
      console.error('Error deleting post:', error);
      errorMessage({ message: m.components_newsPage_cards_newsCard_error_delete() });
      appInsights.trackException({
        exception: new Error('Failed to delete post', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  return state.isEditing(post) ? (
    <WriteCommentCard
      content={{
        ...post,
        comment: post.content,
      }}
      onSubmit={(updatedText) => handleUpdate(updatedText, user)}
      onDiscard={interactions.onCancelEdit}
    />
  ) : (
    <>
      <CommentCardHeader content={post} avatar={{ size: 32 }} />
      <CardContentWrapper>
        <Typography color="text.primary" variant="body1" data-testid="text">
          {parseStringForLinks(post.content, searchString)}
        </Typography>
      </CardContentWrapper>
      <NewsCardControls>
        {userIsAuthor && <EditControls onEdit={() => interactions.onStartEdit(post)} onDelete={handleDelete} />}
        <ResponseControls onResponse={() => interactions.onStartResponse(post)} />
      </NewsCardControls>
    </>
  );
}

export default NewsPostCard;
