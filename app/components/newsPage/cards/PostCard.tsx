import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useUser } from '@/app/contexts/user-context';
import { Post, UserSession } from '@/common/types';
import { CommentCardHeader } from '@/components/common/CommentCardHeader';
import { EditControls } from '@/components/common/editing/controls/EditControls';
import { ResponseControls } from '@/components/common/editing/controls/ResponseControl';
import { useEditingInteractions, useEditingState } from '@/components/common/editing/editing-context';
import { NewsCardActionsWrapper } from '@/components/newsPage/cards/common/NewsCardActionsWrapper';
import { WriteCommentCard } from '@/components/newsPage/cards/common/WriteCommentCard';
import { deletePost, updatePost } from '@/services/postService';

interface NewsPostCardProps {
  post: Post;
  onUpdate: (updatedText: string) => void;
  onDelete: () => void;
}
function NewsPostCard(props: NewsPostCardProps) {
  const { post, onUpdate, onDelete } = props;
  const state = useEditingState();
  const interactions = useEditingInteractions();
  const { user } = useUser();
  const userIsAuthor = user?.providerId === post.author.providerId;

  const handleDelete = async () => {
    deletePost({ postId: post.id });
    onDelete();
  };

  const handleUpdate = async (updatedText: string, user?: UserSession) => {
    if (user) {
      interactions.onSubmitEdit();
      onUpdate(updatedText);
      await updatePost({ postId: post.id, content: updatedText, user });
    }
  };

  return state.isEditing(post) ? (
    <WriteCommentCard
      content={{ author: post.author, comment: post.content, updatedAt: post.updatedAt }}
      onSubmit={(updatedText) => handleUpdate(updatedText, user)}
      onDiscard={interactions.onCancelEdit}
    />
  ) : (
    <>
      <CommentCardHeader content={post} avatar={{ size: 32 }} />
      <CardContent sx={cardContentStyles}>
        <Box sx={titleWrapperStyles}>
          <Typography color="text.primary" variant="body1">
            {post.content}
          </Typography>
        </Box>
      </CardContent>
      <NewsCardActionsWrapper>
        <Box>
          <Stack direction={'row'}>
            {userIsAuthor && <EditControls onEdit={() => interactions.onStartEdit(post)} onDelete={handleDelete} />}
            <ResponseControls onResponse={() => interactions.onStartResponse(post)} />
          </Stack>
        </Box>
      </NewsCardActionsWrapper>
    </>
  );
}

export default NewsPostCard;

const cardContentStyles = {
  paddingTop: 0,
  padding: 0,
  margin: 0,
  textAlign: 'left',
};

const titleWrapperStyles = {
  marginTop: 10 / 8,
  marginBotom: 10 / 8,
};
