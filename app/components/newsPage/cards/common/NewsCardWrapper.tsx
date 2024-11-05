import React from 'react';

import Card from '@mui/material/Card';

import theme from '@/styles/theme';

interface NewsCardWrapperProps {
  children?: React.ReactNode;
}

const NewsCardWrapper: React.FC<NewsCardWrapperProps> = ({ children }) => {
  return <Card sx={cardStyles}>{children}</Card>;
};

export default NewsCardWrapper;

// News Card Wrapper Styles
const cardStyles = {
  borderRadius: '8px',
  background: 'linear-gradient(0deg, rgba(240, 238, 225, 0.30) 0%, rgba(240, 238, 225, 0.30) 100%), #FFF',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  p: 4,
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  },
  [theme.breakpoints.down('md')]: {
    p: 3,
  },
};
