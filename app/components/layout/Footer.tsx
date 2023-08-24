import Facebook from '@mui/icons-material/Facebook';
import GitHub from '@mui/icons-material/GitHub';
import Instagram from '@mui/icons-material/Instagram';
import LinkedIn from '@mui/icons-material/LinkedIn';
import Twitter from '@mui/icons-material/Twitter';
import YouTube from '@mui/icons-material/YouTube';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function Footer() {
  const iconStyles = {
    marginLeft: 2,
    marginRight: 2,
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        textAlign: 'center',
        paddingBottom: '24px',
        paddingTop: '48px',
      }}
    >
      <Grid container alignItems="center" rowSpacing={2}>
        <Grid item xs={12} md={4}>
          <Facebook color="primary" sx={iconStyles} />
          <Instagram color="primary" sx={iconStyles} />
          <Twitter color="primary" sx={iconStyles} />
        </Grid>
        <Grid container item columnSpacing={2} xs={12} md={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="caption">Copyright ***STRING_REMOVED***  Innohub</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography
              variant="caption"
              sx={{
                borderLeft: { md: '1px solid' },
                borderRight: { md: '1px solid' },
                px: 3,
              }}
            >
              Term of Use
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="caption">Privacy Statement</Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <YouTube color="primary" sx={iconStyles} />
          <LinkedIn color="primary" sx={iconStyles} />
          <GitHub color="primary" sx={iconStyles} />
        </Grid>
      </Grid>
    </Box>
  );
}
