'use client';

import React from 'react';

import { CollaborationQuestion, ObjectType } from '@/common/types';
import NewsItemThread from '@/components/newsPage/threads/NewsItemThread';

interface CommentsProps {
  collaborationQuestion: CollaborationQuestion;
  projectName?: string;
}

const CollaborationCommentsSection = (props: CommentsProps) => {
  const { collaborationQuestion } = props;

  return (
    <NewsItemThread
      entry={{
        item: collaborationQuestion,
        type: ObjectType.COLLABORATION_QUESTION,
      }}
      enableEditing={true}
      maxNumberOfComments={1}
      disableDivider
    />
  );
};

export default CollaborationCommentsSection;
