'use client';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';

import theme from '@/styles/theme';

import ChevronRightIcon from '../icons/ChevronRightIcon';

type BreadcrumbsNavProps = {
  activePage: string;
};

export default function BreadcrumbsNav({ activePage }: BreadcrumbsNavProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
  };

  const breadcrumbs = [
    <Link key="1" href="/" style={{ textDecoration: 'none' }}>
      <Typography variant="caption" color="common.white" sx={typographyStyles}>
        Startseite
      </Typography>
    </Link>,
    <Link key="2" href="/" style={{ textDecoration: 'none', pointerEvents: 'none' }} onClick={handleClick}>
      <Typography variant="caption" color="common.white" sx={{ fontSize: '13px' }}>
        {activePage}
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
  fontSize: '13px',
  ':hover': {
    color: 'secondary.main',
  },
};

const breadcrumbsStyles = {
  marginTop: '32px',
  marginBottom: '30px',

  [theme.breakpoints.down('sm')]: {
    margin: '32px 16px 20px 16px',
  },
};

const iconContainerStyles = {
  marginTop: '3px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
