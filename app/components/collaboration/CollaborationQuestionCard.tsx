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
import { CollaborationQuestion, Comment } from '@/common/types';
import theme from '@/styles/theme';
import { sortDateByCreatedAt } from '@/utils/helpers';

import AvatarIcon from '../common/AvatarIcon';
import { errorMessage } from '../common/CustomToast';
import { parseStringForLinks } from '../common/LinkString';
import { StyledTooltip } from '../common/StyledTooltip';
import { TooltipContent } from '../project-details/TooltipContent';

import { addProjectCollaborationComment } from './comments/actions';
import { CollaborationComments } from './comments/CollaborationComments';
import WriteCommentCard from './writeComment/WriteCommentCard';
import { ShareOpinionCard } from './ShareOpinionCard';

interface UpdateCardProps {
  content: CollaborationQuestion;
  projectName: string;
  projectId: string;
  questionId: string;
}

export const CollaborationQuestionCard = ({ content, projectName, projectId, questionId }: UpdateCardProps) => {
  const { title, description, authors, comments: projectComments } = content;
  const { setCollaborationCommentsAmount } = useProject();
  const [comments, setComments] = useState<Comment[]>(projectComments);
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

  const handleDeleteComment = (comment: Comment) => {
    setComments((old) => old.filter((c) => c.id !== comment.id));
  };

  const handleComment = async (comment: string) => {
    try {
      const { data: newComment } = await addProjectCollaborationComment({ projectId, questionId, comment });
      if (!newComment) {
        console.error('No comment was returned by the server.');
        errorMessage({ message: 'Failed to post the comment. Please try again.' });
        appInsights.trackException({
          exception: new Error('Failed to post the comment.'),
          severityLevel: SeverityLevel.Error,
        });
        return;
      }
      const newComments = sortDateByCreatedAt([...comments, newComment]);
      setComments(newComments);
      setCollaborationCommentsAmount(newComments.length);
    } catch (error) {
      console.error('Failed to submit comment:', error);
      errorMessage({ message: 'Failed to submit your comment. Please try again.' });
      appInsights.trackException({
        exception: new Error('Failed to submit comment.'),
        severityLevel: SeverityLevel.Error,
      });
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
            Frage von
          </Typography>
          <AvatarGroup sx={avatarGroupStyle}>
            {authors.length > 0 ? (
              authors.map((author, index) => (
                <StyledTooltip
                  arrow
                  key={index}
                  title={<TooltipContent projectName={projectName} teamMember={author} />}
                  placement="bottom"
                >
                  <AvatarIcon user={author} size={48} index={index} allowAnimation />
                </StyledTooltip>
              ))
            ) : (
              <Typography variant="caption" color="text.disabled">
                Niemand zugewiesen
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
                <WriteCommentCard projectName={projectName} onSubmit={handleComment} />
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
            <WriteCommentCard sx={newCommentStyle} projectName={projectName} onSubmit={handleComment} />
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
