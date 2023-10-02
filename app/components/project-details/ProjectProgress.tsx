'use client';
import { useState } from 'react';
import Image from 'next/image';
import MuiMarkdown, { Overrides } from 'mui-markdown';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Box, Divider, IconButton, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';

import { Info, ProjectStatus } from '@/common/types';

import { AuthorInformation } from './AuthorInformation';
import CommentsSection from './CommentsSection';
import { ProjectTags } from './ProjectTags';

import robotic_hand from '/public/images/robotic-hand.png';

interface ProjectProgressProps {
  projectStatus: ProjectStatus;
}

interface InfoItemProps {
  info: Info;
}

const InfoItemRight = ({ info }: InfoItemProps) => {
  return (
    <Card sx={infoItemRightStyles} elevation={0}>
      <CardContent sx={{ p: '18px', pb: 1 }}>
        <Typography variant="subtitle1" color="text.primary" sx={{ textTransform: 'uppercase' }}>
          {info.title}
        </Typography>
      </CardContent>
      <Divider sx={dividerStyle} />

      <CardMedia sx={{ display: 'flex', justifyContent: 'center' }}>
        <Image src={robotic_hand} alt="image" width={235} height={130} />
      </CardMedia>
      <CardContent sx={{ p: '18px' }}>
        <Typography variant="subtitle2" color="text.primary">
          {info.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const ProjectProgress = (props: ProjectProgressProps) => {
  const { projectStatus } = props;
  const [contentSize, setContentSize] = useState<string>('600px');
  const [showMoreButtonVisible, setShowMoreButtonVisible] = useState<boolean>(true);

  const expand = () => {
    setContentSize('100%');
    setShowMoreButtonVisible(false);
  };

  return (
    <Card sx={wrapperStyles}>
      <Stack sx={contentStyles}>
        <Box sx={{ height: contentSize, overflow: 'hidden' }}>
          <Box sx={{ ...showMoreButtonStyle, visibility: showMoreButtonVisible ? 'visible' : 'hidden' }}>
            <IconButton aria-label="delete" sx={{ color: 'rgba(0, 0, 0, 1)' }} onClick={expand}>
              <ArrowDownwardIcon />
            </IconButton>
          </Box>
          <Stack direction="row" spacing={0} justifyContent={'space-between'}>
            <Box>
              <MuiMarkdown overrides={{ style: { color: 'text.primary' } } as unknown as Overrides}>
                {projectStatus.text}
              </MuiMarkdown>
            </Box>
            <Box sx={infoItemRightContainerStyles}>
              <InfoItemRight info={projectStatus.info} />
            </Box>
          </Stack>
        </Box>

        <Divider sx={{ width: '662px' }} />
        <ProjectTags tags={projectStatus.tags} />
        <AuthorInformation author={projectStatus.author} />
        <Divider sx={{ my: 2, width: '662px' }} />
        <CommentsSection />
      </Stack>
    </Card>
  );
};

// Project Progress Styles
const wrapperStyles = {
  position: 'relative',
  borderRadius: '8px',
};

const contentStyles = {
  margin: '88px 64px',
};

const showMoreButtonStyle = {
  background: 'linear-gradient(to bottom, rgba(255,0,0,0), rgba(255,255,255,1))',
  position: 'absolute',
  bottom: '60%',
  paddingTop: '150px',
  textAlign: 'center',
  width: '100%',
  borderRadius: '4px',
  ml: '-32px',
};

const infoItemRightContainerStyles = {
  marginLeft: '5%',
  marginTop: '25%',
};

const infoItemRightStyles = {
  width: 270,
  backgroundColor: '#EBF3F7',
  borderRadius: '8px',
};

const dividerStyle = {
  width: '100%',
  height: '2px',
  bgcolor: 'common.white',
  borderColor: 'common.white',
  mb: '17px',
};
