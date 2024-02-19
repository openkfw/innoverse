'use client';

import React, { useEffect, useState } from 'react';

import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';

import { Comment, CommentResponse } from '@/common/types';
import { TransparentButton } from '@/components/common/TransparentButton';
import { CommentVoteComponent } from '@/components/project-details/comments/VoteComponent';

import WriteCommentCard from '../writeComment/WriteCommentCard';

import {
  getCollaborationCommentResponses,
  handleCollaborationCommentResponse,
  handleCollaborationResponseUpvotedBy,
  handleCollaborationUpvotedBy,
  isCollaborationCommentUpvotedBy,
  isCollaborationResponseUpvotedBy,
} from './actions';
import { CollaborationCommentCard } from './CollaborationCommentCard';

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
    <Stack justifyContent="center" alignContent="center">
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
        <TransparentButton onClick={handleToggle}>
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
    function loadResponseseIfDisplayingThem() {
      async function loadResponses() {
        const loadingResult = await getCollaborationCommentResponses({ comment });
        setResponses(loadingResult.data ?? []);
      }

      if (displayResponses) {
        loadResponses();
        setDisplayResponses(true);
      }
    },
    [comment, displayResponses],
  );

  const handleResponse = async (response: string) => {
    const result = await handleCollaborationCommentResponse({
      comment: comment,
      response: response,
    });

    const commentResponse = result.data as CommentResponse;

    setDisplayResponses(true);
    setOpenResponseInput(false);
    setResponses((old) => [...old, commentResponse]);
  };

  return (
    <Stack>
      <CollaborationCommentCard
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
        <TransparentButton onClick={() => setDisplayResponses(true)}>
          Kommentare anzeigen ({comment.responseCount})
        </TransparentButton>
      )}

      {openResponseInput && (
        <WriteCommentCard
          sx={{ paddingBottom: '2em', marginLeft: '3em' }}
          projectName=""
          handleComment={handleResponse}
        />
      )}

      <Stack sx={{ paddingLeft: '3em' }}>
        {responses.map((response, key) => (
          <div key={key}>
            <CollaborationCommentCard
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
          </div>
        ))}
      </Stack>
    </Stack>
  );
};
