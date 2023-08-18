import { Box, Grid, List, ListItem, Typography } from "@mui/material";
import Image from "next/image";
import featuredProject from "../../assets/feature_project.png";
import CustomChip from "@/components/common/CustomChip";

const FeaturedProjectSliderImage = () => {
  return (
    <Box>
      <Image
        src={featuredProject}
        alt="Project"
        sizes="100vw"
        style={{
          width: "100%",
        }}
      />
    </Box>
  );
};

const FeaturedProjectContent = () => {
  return (
    <Box>
      <Typography variant="overline">featured project</Typography>
      <Typography variant="h2">
        The most talked-about, futuristic product
      </Typography>
      <Box>
        <List aria-label="tags" sx={{ display: "inline-flex" }}>
          <ListItem>
            <CustomChip label="Strategy" />
          </ListItem>
          <ListItem>
            <CustomChip label="AI in Finance" />
          </ListItem>
          <ListItem>
            <CustomChip label="Future" />
          </ListItem>
        </List>
      </Box>
      <Typography variant="body1">
        As in previous years, the company unveiled a feature before it was
        ready. The obvious question soon followed: Should AI software that’s
        smart enough to trick humans be forced to disclose itself.
      </Typography>
    </Box>
  );
};

export const FeaturedProjectSlider = () => {
  return (
    <Grid container spacing={4} sx={{ mb: 5 }}>
      <Grid item xs={6} md={8}>
        <FeaturedProjectSliderImage />
      </Grid>
      <Grid item xs={6} md={4}>
        <FeaturedProjectContent />
      </Grid>
    </Grid>
  );
};
