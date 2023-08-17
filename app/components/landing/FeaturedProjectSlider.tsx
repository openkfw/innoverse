import {
  Box,
  Chip,
  Grid,
  List,
  ListItem,
  Stack,
  Typography
} from "@mui/material";
import Image from "next/image";
import featuredProject from "../../assets/feature_project.png";

const SliderPill = () => {

  const styles = {
    elementWrap: {
      border: '0.50px white solid',
      paddingLeft: "7px",
      paddingRight: "7px",
      paddingTop: "1px",
      paddingBottom: "1px"
    },
    itemNumberLable: {
      color: 'white',
      fontSize: 12,
      fontFamily: '***FONT_REMOVED***',
      fontWeight: '400',
      textTransform: 'uppercase',
      letterSpacing: 1,
      wordWrap: 'break-word'
    },
    itemNameLable: {
      color: 'white',
      fontSize: 20,
      fontFamily: 'PF Centro Sans Pro',
      fontWeight: '1000',
      letterSpacing: 0.15,
      wordWrap: 'break-word'
    }
  }

  return (
    <div>
      <Stack
        direction="row"
        spacing={0}
      >
        <Box sx={styles.elementWrap}>
          <Typography sx={styles.itemNumberLable}>
            #1
          </Typography>
        </Box>
        <Box sx={styles.elementWrap}>
          <Typography sx={styles.itemNameLable}>
            Finance
          </Typography>
        </Box>
      </Stack>


    </div >
  )
}

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
    <>
      <Box>
        <Typography variant="overline">featured project</Typography>
        <Typography variant="h2">
          The most talked-about, futuristic product
        </Typography>
        <Box>
          <List aria-label="tags" sx={{ display: "inline-flex" }}>
            <ListItem>
              <Chip label="Strategy" variant="filled" />
            </ListItem>
            <ListItem>
              <Chip label="AI in Finance" variant="filled" />
            </ListItem>
            <ListItem>
              <Chip label="Future" variant="filled" />
            </ListItem>
          </List>
        </Box>
        <Typography variant="body1">
          As in previous years, the company unveiled a feature before it was
          ready. The obvious question soon followed: Should AI software that’s
          smart enough to trick humans be forced to disclose itself.
        </Typography>
      </Box>
    </>
  );
};

export const FeaturedProjectSlider = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6} md={8}>
          <FeaturedProjectSliderImage />
        </Grid>
        <Grid item xs={6} md={4}>
          <FeaturedProjectContent />
        </Grid>
      </Grid>
      <Box>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
        >
          <SliderPill />
          <SliderPill />
          <SliderPill />

        </Stack>
      </Box>
    </>
  );
};
