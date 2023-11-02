import Image, { StaticImageData } from 'next/image';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { PROJECT_PROGRESS } from '@/common/types';

import AvatarInitialsIcon from '../common/AvatarInitialsIcon';
import ProgressBar from '../common/ProgressBar';

import project from '/public/images/ai_01.png';

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
    <Grid container sx={containerStyles}>
      <Grid item xs={5}>
        <Box>
          <Image unoptimized src={project} alt="Project" sizes="50vw" style={backgroundImageStyles} />
        </Box>
      </Grid>
      <Grid item xs={7}>
        <Card sx={cardStyles}>
          <Typography variant="h2" sx={cardTitleStyles}>
            {title}
          </Typography>
          <Grid container spacing={0} sx={cardBodyStyles}>
            <Grid item sx={avatarContainerStyles}>
              <Box display="flex" flexDirection="column" justifyContent="flex-end" height="100%">
                <CardHeader
                  avatar={
                    avatar ? (
                      <Avatar sx={avatarStyles}>
                        <Image unoptimized src={avatar} alt="avatar" fill sizes="33vw" />
                      </Avatar>
                    ) : (
                      <AvatarInitialsIcon name={author} size={52} />
                    )
                  }
                  title={<Typography variant="body2"> {author}</Typography>}
                  subheader={
                    <Typography variant="caption" sx={{ color: 'common.white' }}>
                      {role}
                    </Typography>
                  }
                  sx={cardHeaderStyles}
                />
              </Box>
            </Grid>
            <Grid item sx={statusContainerStyles}>
              <Typography variant="overline" sx={statusStyles}>
                Status
              </Typography>
              <ProgressBar active={status} />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
}

// Hero section styles

const backgroundImageStyles = {
  width: 720,
  height: 380,
};

const containerStyles = {
  position: 'relative',
  justifyItems: 'center',
  alignItems: 'center',
};

const cardStyles = {
  ml: '10%',
  padding: '32px 24px',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.20)',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  boxShadow: '0px 12px 40px 0px rgba(0, 0, 0, 0.25)',
  backdropFilter: 'blur(20px)',
  width: 588,
  height: 312,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const cardTitleStyles = {
  fontSize: '48px',
};

const cardBodyStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
};

const avatarContainerStyles = {
  padding: 0,
  margin: 0,
};

const avatarStyles = {
  width: 52,
  height: 52,
};

const cardHeaderStyles = {
  paddingBottom: 0,
  paddingLeft: 0,
};

const statusContainerStyles = {
  display: 'flex',
  flexDirection: 'column',
  paddingRight: 1,
};

const statusStyles = {
  textAlign: 'flex-start',
};
