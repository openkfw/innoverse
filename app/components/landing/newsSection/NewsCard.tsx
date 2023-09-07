import * as React from 'react';
import Image, { StaticImageData } from 'next/image';

import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

interface ProjectCardProps {
  title: string;
  subtitle: string;
  publisher: string;
  avatar: StaticImageData;
  theme: string;
  date: string;
}

export default function ProjectCard(props: ProjectCardProps) {
  const { title, subtitle, publisher, avatar, theme, date } = props;
  return (
    <Card sx={{ p: 2, height: 250, borderRadius: '8px' }}>
      <CardHeader
        sx={{ textAlign: 'left' }}
        avatar={
          <Avatar sx={{ width: 24, height: 24 }}>
            <Image src={avatar} alt="avatar" fill />
          </Avatar>
        }
        title={
          <Typography variant="caption" sx={{ color: 'text.primary' }}>
            {publisher}
          </Typography>
        }
      />
      <CardContent sx={{ pt: 0, textAlign: 'left' }}>
        <Typography variant="h6" sx={{ color: 'text.primary' }}>
          {title}
        </Typography>
        <Typography
          sx={{
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            color: 'text.primary',
          }}
          variant="body1"
        >
          {subtitle}
        </Typography>

        <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
          <Grid item>
            <Chip
              label={theme}
              size="small"
              variant="filled"
              color="secondary"
              sx={{ color: 'text.primary', fontSize: 13 }}
            />
          </Grid>
          <Grid item>
            <Typography variant="caption" sx={{ color: 'secondary.contrastText' }}>
              {date}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
