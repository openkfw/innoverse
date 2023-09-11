import { useState } from 'react';

import AvatarGroup from '@mui/material/AvatarGroup';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { ProjectUpdate } from '@/common/types';
import { project_colaboration } from '@/repository/mock/project/project-page';

import AvatarIcon from '../common/AvatarIcon';
import { StyledTooltip } from '../common/StyledTooltip';
import { TooltipContent } from '../project-details/TooltipContent';

import { Comments } from './comments/Comments';
import { ShareOpinionCard } from './ShareOpinionCard';
import WriteCommentCard from './WriteCommentCard';

interface UpdateCardProps {
  content: ProjectUpdate;
}

export const UpdateCard = ({ content }: UpdateCardProps) => {
  const { headline, text, requiredBy, comments } = content;
  const [newCommentText] = useState<string>(project_colaboration.writeCommentText);

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
      <Grid container item xs={6} direction="column" spacing={2}>
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
            benötigter Betrag von
          </Typography>
          <AvatarGroup sx={avatarGroupStyle}>
            {requiredBy.length > 0 ? (
              requiredBy.map((teamMember, i) => (
                <StyledTooltip arrow key={i} title={<TooltipContent teamMember={teamMember} />} placement="bottom">
                  <AvatarIcon src={teamMember.avatar} size={48} />
                </StyledTooltip>
              ))
            ) : (
              <Typography variant="caption" color="text.disabled">
                Kein Member zugewiesen
              </Typography>
            )}
          </AvatarGroup>
        </Grid>
      </Grid>

      {comments.length > 0 ? (
        <Grid container item spacing={2} xs={6}>
          <ShareOpinionCard />
          <Comments comments={comments} />
        </Grid>
      ) : (
        <Grid container item xs={6}>
          <WriteCommentCard text={newCommentText} />
        </Grid>
      )}
    </Grid>
  );
};
