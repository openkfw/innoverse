import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const footerNav = ['© ***STRING_REMOVED***  2023', 'Impressum', 'DSGVO'];

function Footer() {
  const footerStyle = {
    paddingLeft: 24,
    paddingTop: '48px',
    paddingBottom: '48px',
  };

  const typographyStyle = {
    fontWeight: 700,
    fontFamily: '***FONT_REMOVED***',
    fontSize: '14px',
  };

  return (
    <Grid container spacing={3} sx={footerStyle}>
      {footerNav.map((link, key) => (
        <Grid key={key} item>
          <Typography sx={typographyStyle}>{link}</Typography>
        </Grid>
      ))}
    </Grid>
  );
}

export default Footer;
