import { useState } from 'react';

import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useProject } from '@/app/contexts/project-context';
import { CollaborationQuestion, Comment } from '@/common/types';
import { sortDateByCreatedAt } from '@/utils/helpers';

import AvatarIcon from '../common/AvatarIcon';
import { parseStringForLinks } from '../common/LinkString';
import { StyledTooltip } from '../common/StyledTooltip';
import { TooltipContent } from '../project-details/TooltipContent';

import { handleCollaborationComment } from './comments/actions';
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
  };

  const handleShareOpinion = () => {
    setWriteNewComment(true);
  };

  const handleComment = async (comment: string) => {
    const { data: newComment } = await handleCollaborationComment({ projectId, questionId, comment });
    if (!newComment) return;
    const newComments = sortDateByCreatedAt([...comments, newComment]);
    setComments(newComments);
    setCollaborationCommentsAmount(newComments.length);
  };

  return (
    <Grid container spacing={5}>
      <Grid container item xs={6} direction="column" spacing={2} sx={{ paddingRight: '100px' }}>
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

      <Grid container item xs={6} spacing={2}>
        <Box sx={{ marginLeft: '-20px' }}>
          {comments.length > 0 ? (
            <Stack spacing={3}>
              {writeNewComment ? (
                <WriteCommentCard projectName={projectName} handleComment={handleComment} />
              ) : (
                <ShareOpinionCard projectName={projectName} handleClick={handleShareOpinion} />
              )}
              <CollaborationComments comments={comments} />
            </Stack>
          ) : (
            <WriteCommentCard projectName={projectName} handleComment={handleComment} />
          )}
        </Box>
      </Grid>
    </Grid>
  );
};
