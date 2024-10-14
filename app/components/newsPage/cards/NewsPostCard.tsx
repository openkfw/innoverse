import { useState } from 'react';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import Typography from '@mui/material/Typography';

import { useUser } from '@/app/contexts/user-context';
import { Post, UserSession } from '@/common/types';
import CardContentWrapper from '@/components/common/CardContentWrapper';
import { CommentCardHeader } from '@/components/common/CommentCardHeader';
import { errorMessage } from '@/components/common/CustomToast';
import { useEditingInteractions, useEditingState } from '@/components/common/editing/editing-context';
import { parseStringForLinks } from '@/components/common/LinkString';
import { WriteCommentCard } from '@/components/newsPage/cards/common/WriteCommentCard';
import { updatePost } from '@/services/postService';
import * as m from '@/src/paraglide/messages.js';
import { appInsights } from '@/utils/instrumentation/AppInsights';

interface NewsPostCardProps {
  post: Post;
}
function NewsPostCard(props: NewsPostCardProps) {
  const [post, setPost] = useState(props.post);

  const state = useEditingState();
  const editingInteractions = useEditingInteractions();
  const { user } = useUser();

  const handleUpdate = async (updatedText: string, user?: UserSession) => {
    try {
      if (user) {
        updatePost({ postId: post.id, content: updatedText, user });
        setPost({ ...post, content: updatedText });
        editingInteractions.onSubmit();
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

  return state.isEditing(post) ? (
    <WriteCommentCard
      content={{
        ...post,
        comment: post.content,
      }}
      onSubmit={(updatedText) => handleUpdate(updatedText, user)}
      onDiscard={editingInteractions.onCancel}
    />
  ) : (
    <>
      <CommentCardHeader content={post} avatar={{ size: 32 }} />
      <CardContentWrapper>
        <Typography color="text.primary" variant="body1" data-testid="text">
          {parseStringForLinks(post.content)}
        </Typography>
      </CardContentWrapper>
    </>
  );
}

export default NewsPostCard;
