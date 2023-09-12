import { Box, Divider, Grid, Typography } from '@mui/material';

interface PhaseColumnProps {
  title: string;
  description: string;
  projects: string[];
  icon: any;
  isFirstStep: boolean | undefined;
}

export default function PhaseColumn(props: PhaseColumnProps) {
  const { title, description, projects, icon, isFirstStep } = props;
  return (
    <Grid item xs={4}>
      <Box sx={{ marginBottom: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <Box style={{ height: 64, flexShrink: 0 }}>
          {isFirstStep ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="340" height="64" viewBox="0 0 340 64" fill="none">
              <path
                d="M0 4C0 1.79086 1.79086 0 4 0H311.463C312.623 0 313.727 0.504136 314.487 1.38155L338.733 29.3816C340.034 30.8846 340.034 33.1154 338.733 34.6185L314.487 62.6185C313.727 63.4959 312.623 64 311.463 64H4.00001C1.79087 64 0 62.2091 0 60V4Z"
                fill="white"
              />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="337" height="64" viewBox="0 0 337 64" fill="none">
              <path
                d="M1.54928 6.33355C-0.351581 3.68715 1.53973 0 4.79806 0H308.463C309.623 0 310.727 0.504136 311.487 1.38155L335.733 29.3816C337.034 30.8846 337.034 33.1154 335.733 34.6185L311.487 62.6185C310.727 63.4959 309.623 64 308.463 64H4.79808C1.53975 64 -0.351581 60.3129 1.54928 57.6665L18.3089 34.3335C19.3106 32.9391 19.3106 31.0609 18.3089 29.6665L1.54928 6.33355Z"
                fill="white"
              />
            </svg>
          )}
        </Box>
        <Box sx={{ position: 'absolute' }}>
          <Typography
            variant="h6"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              textAlign: 'center',
              color: 'text.primary',
            }}
          >
            {icon}
            {title}
          </Typography>
        </Box>
      </Box>

      <Typography variant="subtitle1" sx={{ minHeight: '150px' }}>
        {description}
      </Typography>
      <Divider sx={{ mt: 2, height: '1px', opacity: 0.2, borderColor: 'white' }} />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Projekte
      </Typography>
      {projects.map((project) => {
        return (
          <Typography
            variant="subtitle2"
            key={project}
            sx={{
              cursor: 'pointer',
              fontFamily: '***FONT_REMOVED***',
              fontWeight: 700,
              color: 'primary.contrastText',
              '&:hover': {
                color: 'secondary.main',
              },
            }}
          >
            {project}
          </Typography>
        );
      })}
    </Grid>
  );
}
