import * as React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { ProjectUpdate } from '@/common/types';
import EmojiReactionCard from '@/components/collaboration/emojiReactions/EmojiReactionCard';
import AvatarIcon from '@/components/common/AvatarIcon';
import theme from '@/styles/theme';
import { formatDate } from '@/utils/helpers';

interface ProjectCardProps {
  item: ProjectUpdate;
}

export default function NewsCard(props: ProjectCardProps) {
  const { item } = props;
  const { title, comment, author, topic, date } = item;

  return (
    <Card sx={cardStyles}>
      <CardHeader
        sx={cardHeaderStyles}
        avatar={<AvatarIcon user={author} size={24} />}
        title={
          <Typography variant="caption" sx={{ color: 'text.primary' }}>
            {author.name}
          </Typography>
        }
      />

      <CardContent sx={cardContentStyles}>
        <Box sx={titleWrapperStyles}>
          <Typography variant="h6" sx={titleStyles}>
            {title}
          </Typography>

          <Typography sx={subtitleStyles} variant="body1">
            {comment}
          </Typography>
        </Box>

        <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
          <Grid item>
            {topic && <Chip label={topic} size="small" variant="filled" color="secondary" sx={chipStyles} />}
          </Grid>

          <Grid item>
            <Typography variant="caption" sx={{ color: 'secondary.contrastText' }}>
              {formatDate(date)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      <Box style={{ flexGrow: '1' }} />

      <CardActions disableSpacing sx={{ m: -1, p: 0, height: 'auto' }}>
        <EmojiReactionCard updateId={item.id} />
      </CardActions>
    </Card>
  );
}

// News Card Styles
const cardStyles = {
  padding: 3,
  height: '17rem',
  borderRadius: '8px',
  marginRight: '24px',
  [theme.breakpoints.up('sm')]: {
    width: '368px',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    width: '100%',
  },
  display: 'flex',
  flexDirection: 'column',
};

const cardHeaderStyles = {
  textAlign: 'left',
  padding: 0,
  marginTop: 1,
  '& .MuiCardHeader-avatar': {
    marginRight: 1,
  },
};

const cardContentStyles = {
  paddingTop: 0,
  padding: 0,
  margin: 0,
  textAlign: 'left',
};

const titleWrapperStyles = {
  marginTop: 10 / 8,
  marginBotom: 10 / 8,
};

const titleStyles = {
  color: 'text.primary',
};

const subtitleStyles = {
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  color: 'text.primary',
};

const chipStyles = {
  color: 'text.primary',
  fontSize: 13,
};
