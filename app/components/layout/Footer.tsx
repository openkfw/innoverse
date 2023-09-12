import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

function Footer() {
  return (
    <Grid container justifyContent="left" sx={{ display: 'flex', gap: 3 }} spacing={1}>
      <Grid item>
        <Typography sx={{ fontWeight: 700 }}>© ***STRING_REMOVED***  2023</Typography>
      </Grid>
      <Grid item>
        <Typography sx={{ fontWeight: 700 }}>Impressum</Typography>
      </Grid>
      <Grid item>
        <Typography sx={{ fontWeight: 700 }}>DSGVO</Typography>
      </Grid>
      <Grid item>
        <Typography sx={{ fontWeight: 700 }}>ksv.de</Typography>
      </Grid>
    </Grid>
  );
}

export default Footer;
