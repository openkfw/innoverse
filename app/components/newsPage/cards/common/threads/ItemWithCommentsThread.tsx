import { useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

import { CommentWithResponses, NewsComment, PostComment } from '@/common/types';
import { useEditingInteractions } from '@/components/common/editing/editing-context';
import { NewsCommentThread } from '@/components/newsPage/cards/common/threads/NewsCommentThread';
import { WriteCommentResponseCard } from '@/components/newsPage/cards/common/WriteCommentResponseCard';
import { CommentThreadSkeleton } from '@/components/newsPage/cards/skeletons/CommentThreadSkeleton';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

interface ItemWithCommentsThreadProps {
  item: { id: string; responseCount: number };
  card: React.ReactNode;
  commentType: 'NEWS_COMMENT' | 'POST_COMMENT';
  fetchResponses: () => Promise<CommentWithResponses[]>;
}

export const ItemWithCommentsThread = ({ item, card, commentType, fetchResponses }: ItemWithCommentsThreadProps) => {
  const [displayResponses, setDisplayResponses] = useState<'hidden' | 'loading' | 'visible'>('hidden');
  const [responses, setResponses] = useState<CommentWithResponses[]>([]);

  const interactions = useEditingInteractions();

  const handleResponse = (response: NewsComment | PostComment) => {
    if (displayResponses === 'hidden') {
      setDisplayResponses('loading');
    }
    interactions.onSubmitResponse();
    const newResponse: CommentWithResponses = { ...response, responses: [] };
    setResponses([...responses, newResponse]);
  };

  const handleDeleteResponse = (response: CommentWithResponses) => {
    const filteredResponses = responses.filter((r) => r.id !== response.id);
    setResponses(filteredResponses);
  };

  useEffect(
    function loadAndSetResponsesIfDisplayed() {
      async function loadResponses() {
        const responses = await fetchResponses();
        setResponses(responses);
        setDisplayResponses('visible');
      }
      if (displayResponses === 'loading') {
        loadResponses();
      }
    },
    [displayResponses, fetchResponses],
  );

  return (
    <>
      {card}

      {(item.responseCount > 0 || responses.length > 0) && <Divider sx={{ my: 1.5 }} />}
      {displayResponses === 'hidden' && item.responseCount > 0 && (
        <Button
          onClick={() => setDisplayResponses('loading')}
          startIcon={<AddIcon color="primary" fontSize="large" />}
          sx={{
            background: 'transparent',
            color: theme.palette.primary.main,
            ':hover': {
              background: 'transparent',
              color: theme.palette.primary.main,
            },
            mr: 'auto',
          }}
          style={{ marginBottom: 2, marginLeft: '-0.5em' }}
        >
          {m.components_newsPage_cards_common_threads_itemWithCommentsThread_showMore()} ({item.responseCount})
        </Button>
      )}
      {displayResponses === 'loading' && <CommentThreadSkeleton />}

      <WriteCommentResponseCard sx={{ mt: 2 }} commentType={commentType} item={item} onResponse={handleResponse} />

      {displayResponses === 'visible' && (
        <Stack spacing={2}>
          {responses.map((response) => (
            <NewsCommentThread
              key={response.id}
              item={item}
              comment={response}
              commentType={commentType}
              onDelete={() => handleDeleteResponse(response)}
            />
          ))}
        </Stack>
      )}
    </>
  );
};
