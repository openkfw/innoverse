import { Divider, Grid, Typography } from '@mui/material';

interface PhaseColumnProps {
  title: string;
  description: string;
  projects: string[];
}

export default function PhaseColumn(props: PhaseColumnProps) {
  const { title, description, projects } = props;
  return (
    <Grid item xs={4}>
      <Typography
        variant="h6"
        sx={{ textAlign: 'center', backgroundColor: 'white', color: 'text.primary', mb: '25px' }}
      >
        {title}
      </Typography>
      <Typography variant="subtitle1">{description}</Typography>
      <Divider sx={{ mt: 2, height: '1px', opacity: 0.2, borderColor: 'white' }} />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Projekte
      </Typography>
      {projects.map((project) => {
        return (
          <Typography variant="subtitle2" key={project}>
            {project}
          </Typography>
        );
      })}
    </Grid>
  );
}
