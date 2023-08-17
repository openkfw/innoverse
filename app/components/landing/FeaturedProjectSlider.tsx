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
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { AnimationHandler, AnimationHandlerResponse } from "react-responsive-carousel/lib/ts/components/Carousel/types";
import featuredProject from "../../assets/feature_project.png";
import featuredProject1 from "../../assets/feature_project1.png";
import "./FeatureProjectSlider.css";

const dummyData = {
  items: [
    {
      imageProps: {
        image: featuredProject,
        title: "Project 1",
        projectFrom: "Jan",
        projectTo: "Feb"
      },
      textAera: {
        title: "The most talked-about, futuristic product",
        tags: ['Strategy', 'AI in Finance', 'Future'],
        description: "  As in previous years, the company unveiled a feature before it was ready. The obvious question soon followed: Should AI software that’s smart enough to trick humans be forced to disclose itself."
      }
    },
    {
      imageProps: {
        image: featuredProject1,
        title: "Project 2",
        projectFrom: "Mar",
        projectTo: "Jun"
      },
      textAera: {
        title: "The most talked-about, futuristic product",
        tags: ['Strategy1', 'AI in Finance1', 'Future1'],
        description: "  As in previous years, the company unveiled a feature before it was ready. The obvious question soon followed: Should AI software that’s smart enough to trick humans be forced to disclose itself."
      }
    },

  ]
}


const SliderPill = (props:
  { active: boolean, itemNumber: string, title: string, projectFrom: String, projectTo: String }) => {

  const { active, itemNumber, title, projectFrom, projectTo } = props;

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
    },
    container: {
      marginLeft: '25px'
    },
    vr: {
      borderLeft: "6px solid white",
      height: "180px",
      marginLeft: "55%",
      top: "0"
    }
  }

  return (
    <>
      {active ? (
        <>
          <Stack direction="column">
            <Box>
              <Box sx={styles.vr} />
            </Box>
            <Stack
              direction="row"
              spacing={0}
              sx={styles.container}
            >
              <Stack>
                <Box sx={styles.elementWrap}>
                  <Typography sx={styles.itemNumberLable}>
                    Project #{itemNumber}
                  </Typography>
                </Box>
                <Box sx={styles.elementWrap}>
                  <Typography sx={styles.itemNumberLable}>
                    {projectFrom} - {projectTo}
                  </Typography>
                </Box>
              </Stack>
              <Box sx={styles.elementWrap}>
                <Typography sx={styles.itemNameLable}>
                  {title}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </>) :
        (<div>
          <Stack
            direction="row"
            spacing={0}
            sx={styles.container}
          >
            <Box sx={styles.elementWrap}>
              <Typography sx={styles.itemNumberLable}>
                #{itemNumber}
              </Typography>
            </Box>
            <Box sx={styles.elementWrap}>
              <Typography sx={styles.itemNameLable}>
                {title}
              </Typography>
            </Box>
          </Stack>
        </div >)}

    </>
  )
}


export const FeaturedProjectSlider = () => {
  //TODO: move css from FeatureProjectSlider.css here...

  return (
    <Carousel
      className="carousel"
      showThumbs={false}
      showStatus={false}
      renderIndicator={renderIndicator}
      animationHandler={fadeAnimationHandler}
      transitionTime={350}
      swipeable
      useKeyboardArrows
      showArrows>
      {
        dummyData.items.map((el: any, id) =>
          <div key={id}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={8}>
                <Image
                  src={el.imageProps.image}
                  alt="Project"
                  sizes="100vw"
                  style={{
                    width: "100%",
                  }} />
              </Grid>
              <Grid item xs={6} md={4}>
                <FeaturedProjectContent
                  title={el.textAera.title}
                  tags={el.textAera.tags}
                  description={el.textAera.description} />
              </Grid>
            </Grid>
          </div>
        )
      }
    </Carousel>
  );
};

const FeaturedProjectContent = (props: { title: string, tags: String[], description: String }) => {
  const { title, tags, description } = props

  return (
    <>
      <Box>
        <Typography variant="overline">featured project</Typography>
        <Typography variant="h2">
          {title}
        </Typography>
        <Box>
          <List aria-label="tags" sx={{ display: "inline-flex" }}>
            {tags.map((el, id) => <ListItem key={id}>
              <Chip label={el} variant="filled" />
            </ListItem>)}

          </List>
        </Box>
        <Typography variant="body1">
          {description}
        </Typography>
      </Box>
    </>
  );
};

const renderIndicator = (
  clickHandler: (e: React.MouseEvent | React.KeyboardEvent) => void,
  isSelected: boolean,
  index: number,
  label?: string
) => {
  return <>
    <Box sx={{ display: "inline-flex" }}>
      <SliderPill
        active={isSelected}
        itemNumber={(index + 1).toString()}
        title={dummyData.items[index].imageProps.title || ""}
        projectFrom={dummyData.items[index].imageProps.projectFrom || ""}
        projectTo={dummyData.items[index].imageProps.projectTo || ""} />
    </Box>
  </>
}

const fadeAnimationHandler: AnimationHandler = (props, state): AnimationHandlerResponse => {
  const transitionTime = props.transitionTime + 'ms';
  const transitionTimingFunction = 'ease-in-out';

  let slideStyle: React.CSSProperties = {
    position: 'absolute',
    display: 'block',
    zIndex: -2,
    minHeight: '100%',
    opacity: 0,
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    transitionTimingFunction: transitionTimingFunction,
    msTransitionTimingFunction: transitionTimingFunction,
    MozTransitionTimingFunction: transitionTimingFunction,
    WebkitTransitionTimingFunction: transitionTimingFunction,
    OTransitionTimingFunction: transitionTimingFunction,
  };

  if (!state.swiping) {
    slideStyle = {
      ...slideStyle,
      WebkitTransitionDuration: transitionTime,
      MozTransitionDuration: transitionTime,
      OTransitionDuration: transitionTime,
      transitionDuration: transitionTime,
      msTransitionDuration: transitionTime,
    };
  }

  return {
    slideStyle,
    selectedStyle: { ...slideStyle, opacity: 1, position: 'relative' },
    prevStyle: { ...slideStyle },
  };
};
