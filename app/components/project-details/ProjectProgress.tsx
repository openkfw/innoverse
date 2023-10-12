'use client';
import { useState } from 'react';
import Image from 'next/image';
import MuiMarkdown, { Overrides } from 'mui-markdown';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Box, Divider, IconButton } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';

import { Project, ProjectDescription } from '@/common/types';

import { AuthorInformation } from './AuthorInformation';
import CommentsSection from './CommentsSection';
import { ProjectTags } from './ProjectTags';

import robotic_hand from '/public/images/robotic-hand.png';

interface ProjectProgressProps {
  project: Project;
}

interface InfoItemProps {
  description: ProjectDescription;
}

const InfoItemRight = ({ description }: InfoItemProps) => {
  return (
    <Card
      sx={{
        width: 270,
        height: 370,
        backgroundColor: '#EBF3F7',
        borderRadius: 'var(--1, 8px)',
      }}
    >
      <CardContent>
        <MuiMarkdown overrides={{ style: { color: 'text.primary' } } as unknown as Overrides}>
          {description.title}
        </MuiMarkdown>
      </CardContent>
      <CardMedia>
        <Image unoptimized src={robotic_hand} alt="image" height={140} style={{ marginLeft: '4%' }} />
      </CardMedia>
      <CardContent>
        <MuiMarkdown overrides={{ style: { color: 'text.primary' } } as unknown as Overrides}>
          {description.summary}
        </MuiMarkdown>
      </CardContent>
    </Card>
  );
};

export const ProjectProgress = (props: ProjectProgressProps) => {
  const { project } = props;
  const [contentSize, setContentSize] = useState<string>('600px');
  const [showMoreButtonVisible, setShowMoreButtonVisible] = useState<boolean>(true);
  const showMoreButtonStyle = {
    background: 'linear-gradient(to bottom, rgba(255,0,0,0), rgba(255,255,255,1))',
    position: 'absolute',
    bottom: '63%',
    paddingTop: '150px',
    textAlign: 'center',
    width: '100%',
    borderRadius: '4px',
    ml: '-32px', //removes default ml from container
  };

  const expand = () => {
    setContentSize('100%');
    setShowMoreButtonVisible(false);
  };

  return (
    <Card
      sx={{
        position: 'relative',
        borderRadius: '24px',
      }}
    >
      <Stack
        sx={{
          margin: 4,
        }}
      >
        <Box
          sx={{
            height: contentSize,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              ...showMoreButtonStyle,
              visibility: showMoreButtonVisible ? 'visible' : 'hidden',
            }}
          >
            <IconButton aria-label="delete" sx={{ color: 'rgba(0, 0, 0, 1)' }} onClick={expand}>
              <ArrowDownwardIcon />
            </IconButton>
          </Box>
          <Stack direction="row" spacing={0} justifyContent={'space-between'}>
            <Box
              sx={{
                m: 2,
              }}
            >
              <MuiMarkdown overrides={{ style: { color: 'text.primary' } } as unknown as Overrides}>
                {project.description.text}
              </MuiMarkdown>
            </Box>
            <Box
              sx={{
                ml: '5%',
                mt: '25%',
              }}
            >
              <InfoItemRight description={project.description} />
            </Box>
          </Stack>
        </Box>

        <Divider sx={{ width: '662px' }} />
        <ProjectTags tags={project.description.tags} />
        <AuthorInformation author={project.description.author} />
        <Divider sx={{ my: 2, width: '662px' }} />
        <CommentsSection />
      </Stack>
    </Card>
  );
};
