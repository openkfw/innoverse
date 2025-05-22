import { useState } from 'react';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import Typography from '@mui/material/Typography';

import { NewsFeedEntry, Post } from '@/common/types';
import CardContentWrapper from '@/components/common/CardContentWrapper';
import { CommentCardHeader } from '@/components/common/CommentCardHeader';
import { errorMessage } from '@/components/common/CustomToast';
import { useEditingInteractions, useEditingState } from '@/components/common/editing/editing-context';
import { parseStringForLinks } from '@/components/common/LinkString';
import { WriteCommentCard } from '@/components/newsPage/cards/common/WriteCommentCard';
import * as m from '@/src/paraglide/messages.js';
import { appInsights } from '@/utils/instrumentation/AppInsights';

import { handlePostUpdate } from '../addPost/form/actions';

import { NewsCardActions } from './common/NewsCardActions';

interface NewsPostCardProps {
  entry: NewsFeedEntry;
}

function NewsPostCard({ entry }: NewsPostCardProps) {
  const [item, setItem] = useState(entry.item as Post);

  const state = useEditingState();
  const editingInteractions = useEditingInteractions();

  const handleUpdateComment = async (updatedText: string) => {
    try {
      await handlePostUpdate({ itemId: entry.item.id, comment: updatedText });
      setItem({ ...item, comment: updatedText });
      editingInteractions.onSubmit();
    } catch (error) {
      console.error('Error updating post:', error);
      errorMessage({ message: m.components_newsPage_cards_newsCard_error_update() });
      appInsights.trackException({
        exception: new Error('Failed to update post', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  return state.isEditing(item) ? (
    <WriteCommentCard
      content={{ ...item, text: item.comment }}
      onSubmit={(updatedText) => handleUpdateComment(updatedText)}
      onDiscard={editingInteractions.onCancel}
    />
  ) : (
    <>
      <CommentCardHeader content={item} avatar={{ size: 32 }} />
      <CardContentWrapper>
        <Typography color="text.primary" variant="body1" data-testid="text">
          {parseStringForLinks(item.comment)}
        </Typography>
      </CardContentWrapper>
      <NewsCardActions entry={entry} />
    </>
  );
}

export default NewsPostCard;
