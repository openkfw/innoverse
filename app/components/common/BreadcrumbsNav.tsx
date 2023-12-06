'use client';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';

import ChevronRightIcon from '../icons/ChevronRightIcon';

export default function BreadcrumbsNav() {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
  };

  const breadcrumbs = [
    <Link key="1" href="/" style={{ textDecoration: 'none' }}>
      <Typography variant="caption" color="common.white" sx={typographyStyles}>
        Startseite
      </Typography>
    </Link>,
    <Link key="2" href="" style={{ textDecoration: 'none', pointerEvents: 'none' }} onClick={handleClick}>
      <Typography variant="caption" color="common.white">
        Projekt
      </Typography>
    </Link>,
  ];

  return (
    <Breadcrumbs
      sx={breadcrumbsStyles}
      aria-label="breadcrumb-navigation"
      separator={
        <Box sx={iconContainerStyles}>
          <ChevronRightIcon />
        </Box>
      }
    >
      {breadcrumbs}
    </Breadcrumbs>
  );
}

// Breadcrumbs Nav Styles

const typographyStyles = {
  opacity: 0.8,
  ':hover': {
    color: 'secondary.main',
  },
};

const breadcrumbsStyles = {
  marginTop: '32px',
  marginBottom: '45.95px',
};

const iconContainerStyles = {
  marginTop: '3px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
