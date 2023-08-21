import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import CustomButton from "@/components/common/CustomButton";
import ProjectCarousel from "./ProjectCarousel";

export const ProjectSection = () => {
  return (
    <Grid container spacing={5} sx={{ m: 5 }}>
      <Grid item container xs={12}>
        <Grid item xs={9}>
          <Typography variant="overline">current project</Typography>
          <Typography variant="h2">Title projects here</Typography>
        </Grid>
        <Grid item xs={3} sx={{ mt: 6 }}>
          <CustomButton>See all projects</CustomButton>
        </Grid>
      </Grid>
      <ProjectCarousel />
    </Grid>
  );
};
