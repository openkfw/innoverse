import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import CustomButton from "@/components/common/CustomButton";
import NewsCarousel from "./NewsCarousel";

export const NewsSection = () => {
  return (
    <Grid container spacing={5} sx={{ m: 5 }}>
      <Grid item container xs={12}>
        <Grid item xs={9}>
          <Typography variant="overline">latest news</Typography>
          <Typography variant="h2">Title latest news</Typography>
        </Grid>
        <Grid item xs={3} sx={{ mt: 6 }}>
          <CustomButton>See all news</CustomButton>
        </Grid>
      </Grid>
      <NewsCarousel />
    </Grid>
  );
};
