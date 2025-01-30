'use client';
import { useMemo } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { User } from '@/common/types';
import { CommentCardHeaderSecondary } from '@/components/common/CommentCardHeaderSecondary';
import { CommentFooter } from '@/components/common/comments/CommentFooter';
import CustomButton from '@/components/common/CustomButton';
import {
  useEditingInteractions,
  useEditingState,
  useRespondingInteractions,
} from '@/components/common/editing/editing-context';
import WriteTextCard from '@/components/common/editing/writeText/WriteTextCard';
import * as m from '@/src/paraglide/messages.js';
import { mentionRegex } from '@/utils/mentions/formatMentionToText';

import { ClickTooltip } from '../ClickTooltip';
import { TextCard } from '../TextCard';

interface CommentCardProps {
  comment: BasicComment;
  isLiked: boolean;
  projectName?: string;
  enableResponses?: boolean;
  onLikeToggle: () => void;
  onEdit?: (updatedText: string) => Promise<void>;
  onDelete?: () => void;
  commentLikeCount: number;
}

interface BasicComment {
  id: string;
  author: User;
  text: string;
  likedBy: string[];
  updatedAt: Date;
}

export const CommentCard = (props: CommentCardProps) => {
  const {
    comment,
    isLiked,
    projectName,
    enableResponses = false,
    onLikeToggle,
    onEdit,
    onDelete,
    commentLikeCount,
  } = props;

  const state = useEditingState();
  const editingInteractions = useEditingInteractions();
  const respondingInteractions = useRespondingInteractions();

  const updateComment = async (updatedText: string) => {
    if (onEdit) {
      await onEdit(updatedText);
    }
    editingInteractions.onSubmit();
  };

  const mentionedUsers = useMemo(() => {
    const mentionedUsers = new Set<string>();
    let match;

    while ((match = mentionRegex.exec(comment.text)) !== null) {
      const username = match[1];
      if (username) {
        mentionedUsers.add(username);
      }
    }

    const uniqueUsernames = Array.from(mentionedUsers);

    if (uniqueUsernames.length > 0) {
      return uniqueUsernames.map((user) => (
        <ClickTooltip key={user} username={user}>
          <Typography variant="subtitle2" sx={styles.mentionedItem}>
            @{user}
          </Typography>
        </ClickTooltip>
      ));
    } else {
      return null;
    }
  }, [comment.text]);

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
      onDiscard={editingInteractions.onCancel}
      defaultValues={{ text: comment.text }}
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
      text={comment.text}
      header={renderHeader(comment, mentionedUsers)}
      footer={
        <CommentFooter
          author={comment.author}
          likeCount={commentLikeCount}
          isLiked={isLiked}
          onLike={onLikeToggle}
          onEdit={() => editingInteractions.onStart(comment)}
          onDelete={onDelete}
          onResponse={enableResponses ? () => respondingInteractions.onStart(comment) : undefined}
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
