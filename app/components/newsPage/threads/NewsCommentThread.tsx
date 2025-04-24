import { useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';

import { CommentWithResponses, ObjectType } from '@/common/types';
import WriteCommentResponseCard from '@/components/common/comments/WriteCommentResponseCard';
import { TransparentButton } from '@/components/common/TransparentButton';
import { NewsCommentCard } from '@/components/newsPage/cards/NewsCommentCard';
import { addUserComment } from '@/components/newsPage/threads/actions';
import * as m from '@/src/paraglide/messages.js';

interface NewsCommentThreadProps {
  item: { id: string; objectType: ObjectType; projectId?: string };
  comment: CommentWithResponses;
  commentType: ObjectType;
  level: number;
  onDelete: () => void;
  onUpdate: (updatedComment: CommentWithResponses) => void;
  maxNumberOfComments?: number;
}

export const NewsCommentThread = (props: NewsCommentThreadProps) => {
  const { comment, level, maxNumberOfComments } = props;

  const updateComment = (updatedText: string) => {
    props.onUpdate({ ...comment, text: updatedText });
  };

  const handleDeleteResponse = (response: CommentWithResponses) => {
    const responses = comment.comments.filter((r) => r.id !== response.id);
    const updatedComment = { ...comment, comments: responses };
    props.onUpdate(updatedComment);
  };

  const handleUpdateResponse = (response: CommentWithResponses) => {
    const idx = comment.comments.findIndex((r) => r.id === response.id);
    if (idx < 0) return;
    const updatedComment = comment;
    updatedComment.comments[idx] = response;
    props.onUpdate(updatedComment);
  };

  const handleResponse = async (response: string) => {
    const { data: newResponse } = await addUserComment({
      comment: response,
      objectType: props.commentType,
      objectId: props.item.id,
      parentCommentId: comment?.id,
    });

    if (!newResponse) return;

    const threadResponse = { ...newResponse, comments: [] };
    const responses = [threadResponse, ...comment.comments];
    const updatedComment = { ...comment, comments: responses };
    props.onUpdate(updatedComment);
  };

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [maxVisibleComments, setMaxVisibleComments] = useState<CommentWithResponses[]>();
  const [remainingComments, setRemainingComments] = useState<CommentWithResponses[]>();
  const [lengthOfNotShownComments, setLengthOfNotShownComments] = useState<number>();

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    if (!maxNumberOfComments) return;
    setMaxVisibleComments(comment.comments.slice(0, maxNumberOfComments));
    setRemainingComments(comment.comments.slice(maxNumberOfComments, comment.comments.length));
    setLengthOfNotShownComments(Math.max(comment.comments.length - maxNumberOfComments, 0));
  }, [comment.comments, maxNumberOfComments]);

  return (
    <>
      <NewsCommentCard
        comment={comment}
        objectType={props.commentType}
        displayResponseControls={level < 2}
        onDelete={props.onDelete}
        onUpdate={updateComment}
      />

      <WriteCommentResponseCard sx={{ mt: 2 }} comment={comment} onRespond={handleResponse} />

      {maxNumberOfComments ? (
        <Stack spacing={3} justifyContent="center" alignContent="center">
          {maxVisibleComments?.map((comment) => (
            <NewsCommentThread
              key={comment.id}
              item={props.item}
              comment={comment}
              commentType={props.commentType}
              level={level + 1}
              onDelete={() => handleDeleteResponse(comment)}
              onUpdate={handleUpdateResponse}
            />
          ))}

          {isCollapsed &&
            remainingComments?.map((comment) => (
              <Collapse in={isCollapsed} key={comment.id}>
                <NewsCommentThread
                  key={comment.id}
                  item={props.item}
                  comment={comment}
                  commentType={props.commentType}
                  level={level + 1}
                  onDelete={() => handleDeleteResponse(comment)}
                  onUpdate={handleUpdateResponse}
                />
              </Collapse>
            ))}
          {!isCollapsed && comment.comments.length > maxNumberOfComments && (
            <TransparentButton
              onClick={handleToggle}
              startIcon={<AddIcon sx={{ color: 'primary.main' }} fontSize="large" />}
              style={{ marginLeft: '-0.5em', marginBottom: 2 }}
              textSx={{ color: 'primary.main' }}
            >
              {m.components_collaboration_comments_collaborationComments_showMoreComments()} ({lengthOfNotShownComments}
              )
            </TransparentButton>
          )}
        </Stack>
      ) : (
        <Stack sx={{ ml: 4, mt: 2 }} style={{ marginLeft: '2em' }}>
          {comment.comments &&
            comment.comments.map((response) => (
              <NewsCommentThread
                key={response.id}
                item={props.item}
                comment={response}
                commentType={props.commentType}
                level={level + 1}
                onDelete={() => handleDeleteResponse(response)}
                onUpdate={handleUpdateResponse}
              />
            ))}
        </Stack>
      )}
    </>
  );
};
