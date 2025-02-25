import Link from 'next/link';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

const footerNav: { label: string; link: string }[] = [];

function Footer() {
  return (
    <Container maxWidth="lg" sx={footerStyle}>
      <Typography sx={typographyStyle}>
        {m.components_layout_footer_innoVerse()} {new Date().getFullYear()}{' '}
      </Typography>
      {footerNav.map((item, key) => (
        <Link key={key} href={item.link} rel="noopener noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
          <Typography sx={{ ...typographyStyle, ...linkStyles }}>{item.label}</Typography>
        </Link>
      ))}
    </Container>
  );
}

export default Footer;

// Footer styles
const footerStyle = {
  paddingTop: '100px',
  paddingBottom: '63px',
  [theme.breakpoints.down('sm')]: {
    paddingTop: '24px',
    display: 'flex',
    justifyContent: 'center',
  },
};

const typographyStyle = {
  fontWeight: 700,
  fontFamily: 'SansDefaultMed',
  fontSize: '14px',
};

const linkStyles = {
  ':hover': {
    color: 'secondary.main',
  },
};
