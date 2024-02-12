import Link from 'next/link';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import theme from '@/styles/theme';

const footerNav = [
  { label: 'Impressum', link: '***URL_REMOVED***' },
  { label: 'DSGVO', link: '***URL_REMOVED***' },
];

function Footer() {
  return (
    <Grid container spacing={3} sx={footerStyle}>
      <Grid item>
        <Typography sx={typographyStyle}>© ***STRING_REMOVED***  {new Date().getFullYear()} </Typography>
      </Grid>
      {footerNav.map((item, key) => (
        <Grid key={key} item>
          <Link href={item.link} rel="noopener noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
            <Typography sx={{ ...typographyStyle, ...linkStyles }}>{item.label}</Typography>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}

export default Footer;

// Footer styles
const footerStyle = {
  paddingLeft: 24,
  [theme.breakpoints.down('sm')]: {
    paddingLeft: 9,
  },
  marginTop: 0,
  paddingTop: 6,
  paddingBottom: 5,
};

const typographyStyle = {
  fontWeight: 700,
  fontFamily: '***FONT_REMOVED***',
  fontSize: '14px',
};

const linkStyles = {
  ':hover': {
    color: 'secondary.main',
  },
};
