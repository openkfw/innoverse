'use client';

import React, { useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';

import { CommentWithResponses } from '@/common/types';
import { TransparentButton } from '@/components/common/TransparentButton';
import * as m from '@/src/paraglide/messages.js';

import { CollaborationCommentThread } from './CollaborationCommentThread';

interface CommentsProps {
  comments: CommentWithResponses[];
  projectName?: string;
  onDelete: () => void;
}

const MAX_NUM_OF_COMMENTS = 2;

export const CollaborationComments = (props: CommentsProps) => {
  const { comments, projectName } = props;
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [maxVisibleComments, setMaxVisibleComments] = useState<CommentWithResponses[]>();
  const [remainingComments, setRemainingComments] = useState<CommentWithResponses[]>();
  const [lengthOfNotShownComments, setLengthOfNotShownComments] = useState<number>();

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    setMaxVisibleComments(comments.slice(0, MAX_NUM_OF_COMMENTS));
    setRemainingComments(comments.slice(MAX_NUM_OF_COMMENTS, comments.length));
    setLengthOfNotShownComments(Math.max(comments.length - MAX_NUM_OF_COMMENTS, 0));
  }, [comments]);

  return (
    <Stack spacing={3} justifyContent="center" alignContent="center">
      {maxVisibleComments?.map((comment) => (
        <CollaborationCommentThread
          key={comment.id}
          comment={comment}
          projectName={projectName}
          onDelete={props.onDelete}
        />
      ))}

      {isCollapsed &&
        remainingComments?.map((comment) => (
          <Collapse in={isCollapsed} key={comment.id}>
            <CollaborationCommentThread
              key={comment.id}
              comment={comment}
              projectName={projectName}
              onDelete={props.onDelete}
            />
          </Collapse>
        ))}
      {!isCollapsed && comments.length > MAX_NUM_OF_COMMENTS && (
        <TransparentButton
          onClick={handleToggle}
          startIcon={<AddIcon sx={{ color: 'primary.main' }} fontSize="large" />}
          style={{ marginLeft: '-0.5em', marginBottom: 2 }}
          textSx={{ color: 'primary.main' }}
        >
          {m.components_collaboration_comments_collaborationComments_showMoreComments()} ({lengthOfNotShownComments})
        </TransparentButton>
      )}
    </Stack>
  );
};
