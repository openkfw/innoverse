import { useState } from 'react';

import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { ProjectQuestion } from '@/common/types';
import { project_colaboration } from '@/repository/mock/project/project-page';

import AvatarIcon from '../common/AvatarIcon';
import { StyledTooltip } from '../common/StyledTooltip';
import { TooltipContent } from '../project-details/TooltipContent';

import { Comments } from './comments/Comments';
import { ShareOpinionCard } from './ShareOpinionCard';
import WriteCommentCard from './WriteCommentCard';

interface UpdateCardProps {
  content: ProjectQuestion;
  projectName: string;
}

export const QuestionCard = ({ content, projectName }: UpdateCardProps) => {
  const { headline, text, authors } = content;
  const [newCommentText] = useState<string>(project_colaboration.writeCommentText);
  const comments = project_colaboration.projectUpdates[0].comments;

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

  return (
    <Grid container spacing={5}>
      <Grid container item xs={6} direction="column" spacing={2} sx={{ paddingRight: '100px' }}>
        <Grid item>
          <Typography variant="h5" color="secondary.contrastText">
            {headline}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1" color="secondary.contrastText">
            {text}
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
                  <AvatarIcon user={author} size={48} index={index} allowAnimation={true} />
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
            <>
              <ShareOpinionCard projectName={projectName} />
              <Comments comments={comments} />
            </>
          ) : (
            <WriteCommentCard projectName={projectName} text={newCommentText} />
          )}
        </Box>
      </Grid>
    </Grid>
  );
};
