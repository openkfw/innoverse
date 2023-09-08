import * as React from 'react';
import { StaticImageData } from 'next/image';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import AvatarIcon from '@/components/common/AvatarIcon';

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
    <Card sx={{ p: 3, height: 218, borderRadius: '8px' }}>
      <CardHeader
        sx={{ textAlign: 'left', padding: 0, marginTop: 1, '& .MuiCardHeader-avatar': { marginRight: 1 } }}
        avatar={<AvatarIcon src={avatar} size={24} />}
        title={
          <Typography variant="caption" sx={{ color: 'text.primary' }}>
            {publisher}
          </Typography>
        }
      />

      <CardContent sx={{ pt: 0, padding: 0, margin: 0, textAlign: 'left' }}>
        <Box sx={{ marginTop: 10 / 8, marginBotom: 10 / 8 }}>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            {title}
          </Typography>

          <Typography
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              color: 'text.primary',
            }}
            variant="body1"
          >
            {subtitle}
          </Typography>
        </Box>

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
