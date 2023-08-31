import Link from 'next/link';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';

export default function BreadcrumbsNav() {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
  };

  const breadcrumbs = [
    <Link key="1" href="/" style={{ textDecoration: 'none' }}>
      <Typography
        variant="caption"
        color="common.white"
        sx={{
          opacity: 0.8,
          ':hover': {
            color: 'secondary.main',
          },
        }}
      >
        Startseite
      </Typography>
    </Link>,
    <Link key="2" href="/project" style={{ textDecoration: 'none', pointerEvents: 'none' }} onClick={handleClick}>
      <Typography variant="caption" color="common.white">
        Project
      </Typography>
    </Link>,
  ];

  return (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ pb: 3 }} aria-label="breadcrumb-navigation">
      {breadcrumbs}
    </Breadcrumbs>
  );
}
