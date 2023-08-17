import {
  Box,
  Grid,
  List,
  ListItem,
  Stack,
  Typography
} from "@mui/material";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import featured_project from "../../assets/featured_project.png";
import featured_project1 from "../../assets/featured_project1.png";
import featured_project2 from "../../assets/featured_project2.png";

import CustomChip from "../common/CustomChip";
import "./FeatureProjectSlider.css";

const dummyData = {
  items: [
    {
      imageProps: {
        image: featured_project,
        title: "Project 1",
        projectFrom: "Jan",
        projectTo: "Feb"
      },
      textAera: {
        title: "The most talked-about, futuristic product",
        tags: ['Strategy', 'AI in Finance', 'Future'],
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer gravida velit nisl, quis feugiat enim convallis ac. Integer laoreet sed urna semper sagittis. Maecenas velit enim, accumsan nec magna non, aliquam vehicula tortor. In lectus tortor, dapibus mollis pulvinar eu, convallis ac turpis. Nam ut mi fermentum, molestie odio sed, tincidunt mi. Aenean ac luctus orci. Fusce hendrerit velit id fermentum feugiat."
      },
    },
    {
      imageProps: {
        image: featured_project1,
        title: "Project 2",
        projectFrom: "Mar",
        projectTo: "Jun"
      },
      textAera: {
        title: "The most talked-about, futuristic product",
        tags: ['Strategy1', 'AI in Finance1', 'Future1'],
        description: "Suspendisse condimentum enim nec aliquet suscipit. Pellentesque elementum diam at urna rhoncus euismod. Ut tellus ligula, ornare eu finibus at, porta et ex. Quisque vitae rhoncus eros. Suspendisse vel nunc nulla. Ut vel faucibus leo. Ut nec velit vel eros tincidunt faucibus id ac risus. Etiam ornare lectus a rutrum vestibulum. Duis dictum metus leo, quis lacinia quam dictum faucibus. Phasellus sit amet elementum libero, non ornare enim."
      }
    },
    {
      imageProps: {
        image: featured_project2,
        title: "Project 3",
        projectFrom: "Apr",
        projectTo: "Aug"
      },
      textAera: {
        title: "The most talked-about, futuristic product",
        tags: ['Strategy2', 'AI in Finance2', 'Future2'],
        description: "Nullam id turpis non sem sodales gravida non at urna. Etiam in urna at leo imperdiet elementum. Cras imperdiet pulvinar dui, a consequat odio ornare eget. Maecenas vehicula lacus sed sollicitudin sollicitudin. Aliquam convallis, augue et iaculis lacinia, nibh risus porttitor justo, id cursus nunc nulla ut metus. Curabitur pulvinar mi a tortor suscipit, non mattis mauris gravida. Vestibulum nec ornare quam. Phasellus vitae tincidunt tortor."
      }
    },
    {
      imageProps: {
        image: featured_project,
        title: "Project 1",
        projectFrom: "Jan",
        projectTo: "Feb"
      },
      textAera: {
        title: "The most talked-about, futuristic product",
        tags: ['Strategy', 'AI in Finance', 'Future'],
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer gravida velit nisl, quis feugiat enim convallis ac. Integer laoreet sed urna semper sagittis. Maecenas velit enim, accumsan nec magna non, aliquam vehicula tortor. In lectus tortor, dapibus mollis pulvinar eu, convallis ac turpis. Nam ut mi fermentum, molestie odio sed, tincidunt mi. Aenean ac luctus orci. Fusce hendrerit velit id fermentum feugiat."
      },
    },
    {
      imageProps: {
        image: featured_project1,
        title: "Project 2",
        projectFrom: "Mar",
        projectTo: "Jun"
      },
      textAera: {
        title: "The most talked-about, futuristic product",
        tags: ['Strategy1', 'AI in Finance1', 'Future1'],
        description: "Suspendisse condimentum enim nec aliquet suscipit. Pellentesque elementum diam at urna rhoncus euismod. Ut tellus ligula, ornare eu finibus at, porta et ex. Quisque vitae rhoncus eros. Suspendisse vel nunc nulla. Ut vel faucibus leo. Ut nec velit vel eros tincidunt faucibus id ac risus. Etiam ornare lectus a rutrum vestibulum. Duis dictum metus leo, quis lacinia quam dictum faucibus. Phasellus sit amet elementum libero, non ornare enim."
      }
    },
    {
      imageProps: {
        image: featured_project2,
        title: "Project 3",
        projectFrom: "Apr",
        projectTo: "Aug"
      },
      textAera: {
        title: "The most talked-about, futuristic product",
        tags: ['Strategy2', 'AI in Finance2', 'Future2'],
        description: "Nullam id turpis non sem sodales gravida non at urna. Etiam in urna at leo imperdiet elementum. Cras imperdiet pulvinar dui, a consequat odio ornare eget. Maecenas vehicula lacus sed sollicitudin sollicitudin. Aliquam convallis, augue et iaculis lacinia, nibh risus porttitor justo, id cursus nunc nulla ut metus. Curabitur pulvinar mi a tortor suscipit, non mattis mauris gravida. Vestibulum nec ornare quam. Phasellus vitae tincidunt tortor."
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
      borderLeft: "1px solid white",
      height: "180px",
      marginLeft: "56.5%",
      top: "0"
    },
    fadeIn: {

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
        </div >)
      }

    </>
  )
}


export const FeaturedProjectSlider = () => {
  //TODO: move css from FeatureProjectSlider.css here...
  const [selectedItem, setSelectedItem] = useState<number>(0)

  return (
    <Carousel
      className="carousel"
      showThumbs={false}
      showStatus={false}
      renderIndicator={(clickHandler: (e: React.MouseEvent | React.KeyboardEvent) => void,
        isSelected: boolean,
        index: number,
        label: string) => renderIndicator(clickHandler, isSelected, index, label, setSelectedItem)}
      selectedItem={selectedItem}
      transitionTime={700}
      swipeable
      showArrows={false}
    >
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
                    height: "500px"
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
              <CustomChip label={el} variant="filled" />
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
  label: string,
  setSelectedItem: Dispatch<SetStateAction<number>>
) => {
  const handleClick = (index: number) => {
    setSelectedItem(index)
  }
  return <>
    <Box sx={{ display: "inline-flex", cursor: "pointer" }} onClick={() => handleClick(index)} >
      <SliderPill
        active={isSelected}
        itemNumber={(index + 1).toString()}
        title={dummyData.items[index].imageProps.title || ""}
        projectFrom={dummyData.items[index].imageProps.projectFrom || ""}
        projectTo={dummyData.items[index].imageProps.projectTo || ""}
      />
    </Box>
  </>
}
