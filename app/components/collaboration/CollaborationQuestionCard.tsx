'use client';

import { useState } from 'react';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useProject } from '@/app/contexts/project-context';
import { CollaborationComment, CollaborationQuestion } from '@/common/types';
import { UserAvatar } from '@/components/common/UserAvatar';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';
import { sortDateByCreatedAtDesc } from '@/utils/helpers';

import { errorMessage } from '../common/CustomToast';
import WriteTextCard from '../common/editing/writeText/WriteTextCard';
import { parseStringForLinks } from '../common/LinkString';

import { addProjectCollaborationComment } from './comments/actions';
import { CollaborationComments } from './comments/CollaborationComments';
import { ShareOpinionCard } from './ShareOpinionCard';

interface CollaborationQuestionCardProps {
  content: CollaborationQuestion;
  projectId: string;
  questionId: string;
  projectName?: string;
}

type CollaborationCommentWithDate = CollaborationComment & {
  createdAt: Date;
  updatedAt: Date;
};

export const CollaborationQuestionCard = ({
  content,
  projectId,
  questionId,
  projectName,
}: CollaborationQuestionCardProps) => {
  const { title, description, authors, comments: projectComments } = content;
  const { setCollaborationCommentsAmount } = useProject();
  const sortedProjectComments = sortDateByCreatedAtDesc(projectComments as CollaborationCommentWithDate[]);

  const [comments, setComments] = useState<CollaborationComment[]>(sortedProjectComments);
  const [writeNewComment, setWriteNewComment] = useState(false);
  const appInsights = useAppInsightsContext();

  const avatarGroupStyle = {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    color: 'rgba(0, 0, 0, 0.10)',
    '& .MuiAvatar-colorDefault': {
      border: '2px solid white',
      background: 'linear-gradient(84deg, #85898b 0%, #ffffff 100%)',
      color: 'rgba(0, 0, 0, 0.56)',
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: '40px',
    },
  };

  const commentWrapperStyle = {
    marginLeft: '-16px',
    width: 'calc(100% + 16px)',
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
    },
  };

  const handleShareOpinion = () => {
    setWriteNewComment(true);
  };

  const handleDeleteComment = (comment: CollaborationComment) => {
    setComments((old) => old.filter((c) => c.id !== comment.id));
  };

  const handleComment = async (comment: string) => {
    try {
      const { data: newComment } = await addProjectCollaborationComment({ projectId, questionId, comment });
      if (!newComment) {
        console.error('No comment was returned by the server.');
        errorMessage({ message: m.components_collaboration_collaborationQuestionCard_postError() });
        appInsights.trackException({
          exception: new Error('Failed to post the comment.'),
          severityLevel: SeverityLevel.Error,
        });
        return;
      }
      const newComments = [newComment, ...comments];
      setComments(newComments);
      setCollaborationCommentsAmount(newComments.length);
    } catch (error) {
      console.error('Failed to submit comment:', error);
      errorMessage({ message: m.components_collaboration_collaborationQuestionCard_submitError() });
      appInsights.trackException({
        exception: new Error('Failed to submit comment.'),
        severityLevel: SeverityLevel.Error,
      });
    } finally {
      setWriteNewComment(false);
    }
  };

  return (
    <Grid container>
      <Grid container item xs={12} md={6} direction="column" spacing={2} sx={leftGridStyle}>
        <Grid item>
          <Typography variant="h5" color="secondary.contrastText">
            {title}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1" color="secondary.contrastText">
            {parseStringForLinks(description)}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="overline" color="primary.main">
            {m.components_collaboration_collaborationQuestionCard_question()}
          </Typography>
          <AvatarGroup sx={avatarGroupStyle}>
            {authors.length > 0 ? (
              authors.map((author, idx) => <UserAvatar key={idx} size={48} user={author} allowAnimation />)
            ) : (
              <Typography variant="caption" color="text.disabled">
                {m.components_collaboration_collaborationQuestionCard_noAssigned()}
              </Typography>
            )}
          </AvatarGroup>
        </Grid>
      </Grid>
      <Grid container item xs={12} md={6}>
        <Box sx={commentWrapperStyle}>
          {comments.length > 0 ? (
            <Stack spacing={3}>
              {writeNewComment ? (
                <WriteTextCard metadata={{ projectName }} onSubmit={handleComment} />
              ) : (
                <ShareOpinionCard projectName={projectName} handleClick={handleShareOpinion} />
              )}
              <CollaborationComments
                comments={comments}
                projectName={projectName}
                onDeleteComment={handleDeleteComment}
              />
            </Stack>
          ) : (
            <WriteTextCard sx={newCommentStyle} metadata={{ projectName }} onSubmit={handleComment} />
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

const newCommentStyle: SxProps = {
  [theme.breakpoints.down('md')]: {
    marginBottom: '2em',
  },
};

const leftGridStyle: SxProps = {
  paddingRight: '2em',
  [theme.breakpoints.down('md')]: {
    paddingRight: 0,
  },
};
