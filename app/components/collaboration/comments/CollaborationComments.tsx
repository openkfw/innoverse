'use client';

import React, { useEffect, useState } from 'react';

import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';

import { Comment, CommentResponse } from '@/common/types';
import { errorMessage } from '@/components/common/CustomToast';
import { TransparentButton } from '@/components/common/TransparentButton';
import { CommentVoteComponent } from '@/components/project-details/comments/VoteComponent';

import { CommentCard } from '../../common/CommentCard';
import WriteCommentCard from '../writeComment/WriteCommentCard';

import {
  getCollaborationCommentResponses,
  handleCollaborationCommentResponse,
  handleCollaborationResponseUpvotedBy,
  handleCollaborationUpvotedBy,
  isCollaborationCommentUpvotedBy,
  isCollaborationResponseUpvotedBy,
} from './actions';

interface CommentsProps {
  comments: Comment[];
}

interface CollaborationCommentThreadProps {
  comment: Comment;
  openResponseInput: boolean;
  setOpenResponseInput: (open: boolean) => void;
}

const MAX_NUM_OF_COMMENTS = 2;

export const CollaborationComments = ({ comments }: CommentsProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [maxVisibleComments, setMaxVisibleComments] = useState<Comment[]>();
  const [remainingComments, setRemainingComments] = useState<Comment[]>();
  const [lengthOfNotShownComments, setLengthOfNotShownComments] = useState<number>();

  const [commentThreadContext, setCommentThreadContext] = useState<{ isOpen: boolean; commentId: string }>({
    isOpen: false,
    commentId: '',
  });

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
      {maxVisibleComments?.map((comment, key) => (
        <CollaborationCommentThread
          key={key}
          comment={comment}
          setOpenResponseInput={(isOpen) => setCommentThreadContext({ isOpen, commentId: comment.id })}
          openResponseInput={commentThreadContext.isOpen && commentThreadContext.commentId == comment.id}
        />
      ))}

      {isCollapsed &&
        remainingComments?.map((comment, key) => (
          <Collapse in={isCollapsed} key={key}>
            <CollaborationCommentThread
              comment={comment}
              setOpenResponseInput={(isOpen) => setCommentThreadContext({ isOpen, commentId: comment.id })}
              openResponseInput={commentThreadContext.isOpen && commentThreadContext.commentId == comment.id}
            />
          </Collapse>
        ))}
      {!isCollapsed && comments.length > MAX_NUM_OF_COMMENTS && (
        <TransparentButton onClick={handleToggle} style={{ marginLeft: '1.5em' }}>
          weitere Rückmeldungen anzeigen ({lengthOfNotShownComments})
        </TransparentButton>
      )}
    </Stack>
  );
};

const CollaborationCommentThread = ({
  comment,
  openResponseInput,
  setOpenResponseInput,
}: CollaborationCommentThreadProps) => {
  const [displayResponses, setDisplayResponses] = useState(false);
  const [responses, setResponses] = useState([] as CommentResponse[]);

  useEffect(
    function loadResponsesIfDisplayingThem() {
      async function loadResponses() {
        try {
          const loadingResult = await getCollaborationCommentResponses({ comment });
          setResponses(loadingResult.data ?? []);
        } catch (error) {
          console.error('Failed to load responses:', error);
          errorMessage({ message: 'Failed to load comment responses. Please try again.' });
        }
      }

      if (displayResponses) {
        loadResponses();
        setDisplayResponses(true);
      }
    },
    [comment, displayResponses],
  );

  const handleResponse = async (response: string) => {
    try {
      const result = await handleCollaborationCommentResponse({
        comment: comment,
        response: response,
      });
      const commentResponse = result.data as CommentResponse;
      setDisplayResponses(true);
      setOpenResponseInput(false);
      setResponses((old) => [...old, commentResponse]);
    } catch (error) {
      console.error('Failed to submit response:', error);
      errorMessage({ message: 'Submitting your response failed. Please try again.' });
    }
  };

  return (
    <Stack spacing={3} className="test">
      <CommentCard
        content={comment}
        voteComponent={
          <CommentVoteComponent
            commentId={comment.id}
            handleUpvote={handleCollaborationUpvotedBy}
            isUpvoted={isCollaborationCommentUpvotedBy}
            upvotedBy={comment.upvotedBy}
            handleClickOnResponse={() => setOpenResponseInput(true)}
          />
        }
      />

      {!displayResponses && comment.responseCount > 0 && (
        <TransparentButton onClick={() => setDisplayResponses(true)} style={{ marginTop: '1em', marginLeft: '1.5em' }}>
          Kommentare anzeigen ({comment.responseCount})
        </TransparentButton>
      )}

      {openResponseInput && (
        <WriteCommentCard sx={{ paddingLeft: '2.5em' }} projectName="" handleComment={handleResponse} />
      )}

      {responses.length > 0 && (
        <Stack spacing={3} sx={{ paddingLeft: '2.5em' }}>
          {responses.map((response, key) => (
            <CommentCard
              key={key}
              content={{ ...response, comment: response.response }}
              voteComponent={
                <CommentVoteComponent
                  commentId={response.id}
                  handleUpvote={handleCollaborationResponseUpvotedBy}
                  isUpvoted={isCollaborationResponseUpvotedBy}
                  upvotedBy={response.upvotedBy}
                />
              }
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};
