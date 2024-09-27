'use client';
import { useMemo } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { User } from '@/common/types';
import { CommentCardHeaderSecondary } from '@/components/common/CommentCardHeaderSecondary';
import { CommentFooter } from '@/components/common/comments/CommentFooter';
import CustomButton from '@/components/common/CustomButton';
import { useEditingInteractions, useEditingState } from '@/components/common/editing/editing-context';
import WriteTextCard from '@/components/common/editing/writeText/WriteTextCard';
import * as m from '@/src/paraglide/messages.js';

import { TextCard } from '../TextCard';

interface CommentCardProps {
  comment: BasicComment;
  isUpvoted: boolean;
  projectName?: string;
  enableResponses?: boolean;
  onUpvoteToggle: () => void;
  onEdit?: (updatedText: string) => Promise<void>;
  onDelete?: () => void;
}

interface BasicComment {
  id: string;
  author: User;
  comment: string;
  upvotedBy: User[];
  updatedAt: Date;
}

export const CommentCard = (props: CommentCardProps) => {
  const { comment, isUpvoted, projectName, enableResponses = false, onUpvoteToggle, onEdit, onDelete } = props;

  const state = useEditingState();
  const interactions = useEditingInteractions();

  const updateComment = async (updatedText: string) => {
    if (onEdit) {
      await onEdit(updatedText);
    }
    interactions.onSubmitEdit();
  };

  const mentionedUsers = useMemo(() => {
    const mentionRegex = /@\[(.*?)\]\((\d+)\|(.+?)\)/g;
    const mentionedUsers = new Set<string>();
    let match;

    while ((match = mentionRegex.exec(comment.comment)) !== null) {
      const username = match[1];
      if (username) {
        mentionedUsers.add(username);
      }
    }

    const uniqueUsernames = Array.from(mentionedUsers);

    if (uniqueUsernames.length > 0) {
      return uniqueUsernames.map((user) => (
        <Typography variant="subtitle2" key={user} sx={styles.mentionedItem}>
          @{user}
        </Typography>
      ));
    } else {
      return null;
    }
  }, [comment.comment]);

  const renderHeader = (comment: BasicComment, mentionedUsers: JSX.Element[] | null) => (
    <Box sx={styles.headerWrapper}>
      <CommentCardHeaderSecondary content={comment} />
      <Box sx={styles.bull}>•</Box>
      {mentionedUsers}
    </Box>
  );

  return state.isEditing(comment) ? (
    <WriteTextCard
      onSubmit={updateComment}
      onDiscard={interactions.onCancelEdit}
      defaultValues={{ text: comment.comment }}
      metadata={{ projectName }}
      submitButton={
        <CustomButton
          themeVariant="secondary"
          sx={{ mr: 0 }}
          style={{ marginRight: 0 }}
          startIcon={<CheckIcon style={{ marginRight: 0 }} sx={{ ml: 1, pr: 0 }} />}
          endIcon={<></>}
        >
          {m.components_common_comments_commentCard_done()}
        </CustomButton>
      }
    />
  ) : (
    <TextCard
      text={comment.comment}
      header={renderHeader(comment, mentionedUsers)}
      footer={
        <CommentFooter
          author={comment.author}
          upvoteCount={comment.upvotedBy.length}
          isUpvoted={isUpvoted}
          onUpvote={onUpvoteToggle}
          onEdit={() => interactions.onStartEdit(comment)}
          onDelete={onDelete}
          onResponse={enableResponses ? () => interactions.onStartResponse(comment) : undefined}
        />
      }
    />
  );
};

// Comment Card Styles
const styles = {
  headerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  mentionedItem: {
    margin: 0,
    padding: 0,
    alignSelf: 'center',
    marginBottom: '-7px',
    marginRight: '10px',
    color: 'primary.main',
    fontSize: 14,
  },
  bull: {
    margin: 0,
    padding: 0,
    alignSelf: 'center',
    marginBottom: '-7px',
    marginX: '10px',
    color: 'primary.main',
  },
};
