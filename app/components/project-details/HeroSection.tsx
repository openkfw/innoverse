import Image, { StaticImageData } from 'next/image';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { PROJECT_PROGRESS } from '@/common/types';

import ProgressBar from '../common/ProgressBar';

import project from '/public/images/project1.png';

interface HeroSectionProps {
  title: string;
  avatar: StaticImageData;
  author: string;
  role: string;
  status: PROJECT_PROGRESS;
}

export default function HeroSection(props: HeroSectionProps) {
  const { title, avatar, author, role, status } = props;

  return (
    <Grid container sx={{ position: 'relative', justifyItems: 'center', alignItems: 'center' }}>
      <Grid item xs={5}>
        <Box>
          <Image src={project} alt="Project" sizes="50vw" style={{ width: 720, height: 380 }} />
        </Box>
      </Grid>
      <Grid item xs={7}>
        <Card
          sx={{
            ml: '10%',
            p: 4,
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.20)',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            boxShadow: '0px 12px 40px 0px rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(20px)',
            width: 580,
            height: 320,
          }}
        >
          <Typography variant="h2" sx={{ fontSize: '48px' }}>
            {title}
          </Typography>
          <Grid container>
            <Grid item xs={6}>
              <CardHeader
                avatar={
                  <Avatar sx={{ width: 52, height: 52 }}>
                    <Image src={avatar} alt="avatar" fill sizes="33vw" />
                  </Avatar>
                }
                title={<Typography variant="body2"> {author}</Typography>}
                subheader={
                  <Typography variant="caption" sx={{ color: 'secondary.main' }}>
                    {role}
                  </Typography>
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="overline">Status</Typography>
              <ProgressBar active={status} />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
}
