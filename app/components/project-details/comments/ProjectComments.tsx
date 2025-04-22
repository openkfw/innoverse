'use client';

import React from 'react';

import Stack from '@mui/material/Stack';

import { CommentWithResponses } from '@/common/types';

import { ProjectCommentThread } from './ProjectCommentThread';

interface CommentsProps {
  comments: CommentWithResponses[];
  projectName?: string;
  onDelete: (comment: CommentWithResponses) => void;
  onUpdate: (comment: CommentWithResponses) => void;
}

export const ProjectComments = (props: CommentsProps) => {
  const { comments, projectName, onDelete, onUpdate } = props;

  return (
    <Stack spacing={3} justifyContent="center" alignContent="center">
      {comments.map((comment) => (
        <ProjectCommentThread
          key={comment.id}
          comment={comment}
          projectName={projectName}
          onDelete={() => onDelete(comment)}
          onUpdate={() => onUpdate(comment)}
        />
      ))}
    </Stack>
  );
};
