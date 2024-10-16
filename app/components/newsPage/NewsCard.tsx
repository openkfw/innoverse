'use client';

import React from 'react';

import Card from '@mui/material/Card';
import { SxProps, Theme } from '@mui/material/styles';

import { ProjectUpdateWithAdditionalData } from '@/common/types';
import { CommentCardHeader } from '@/components/common/CommentCardHeader';
import { UpdateCardContent } from '@/components/common/UpdateCardContent';
import theme from '@/styles/theme';

interface NewsCardProps {
  update: ProjectUpdateWithAdditionalData;
  sx?: SxProps;
  noClamp?: boolean;
}

export default function NewsCard(props: NewsCardProps) {
  const { update, sx, noClamp = false } = props;

  return (
    <Card sx={{ ...cardStyles, ...sx } as SxProps<Theme>}>
      <CommentCardHeader content={update} />
      <UpdateCardContent update={update} noClamp={noClamp} />
    </Card>
  );
}

// News Card Styles
const cardStyles = {
  px: 3,
  py: 4,
  borderRadius: '8px',
  marginRight: 3,
  height: '105%',
  background: 'linear-gradient(0deg, rgba(240, 238, 225, 0.30) 0%, rgba(240, 238, 225, 0.30) 100%), #FFF',
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
