import { Dispatch, SetStateAction, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { AnimationHandler, AnimationHandlerResponse } from 'react-responsive-carousel/lib/ts/components/Carousel/types';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import CustomChip from '../common/CustomChip';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './FeatureProjectSlider.css';

import featured_project from '/public/images/featured_project.png';
import featured_project1 from '/public/images/featured_project1.png';
import featured_project2 from '/public/images/featured_project2.png';

const dummyData = {
  items: [
    {
      imageProps: {
        image: featured_project,
        title: 'AI Driven',
        projectFrom: 'Jan',
        projectTo: 'Feb',
        year: '2023',
      },
      textAera: {
        title: 'The most talked-about, futuristic product',
        tags: ['Strategy', 'AI in Finance', 'Future'],
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer gravida velit nisl, quis feugiat enim convallis ac. Integer laoreet sed urna semper sagittis. ',
      },
    },
    {
      imageProps: {
        image: featured_project1,
        title: 'Deep Learning',
        projectFrom: 'Mar',
        projectTo: 'Jun',
        year: '2023',
      },
      textAera: {
        title: 'The most talked-about, futuristic product',
        tags: ['Strategy', 'AI in Finance', 'Future'],
        description:
          'Suspendisse condimentum enim nec aliquet suscipit. Pellentesque elementum diam at urna rhoncus euismod. Ut tellus ligula, ornare eu finibus at, porta et ex.',
      },
    },
    {
      imageProps: {
        image: featured_project2,
        title: 'Social',
        projectFrom: 'Apr',
        projectTo: 'Aug',
        year: '2023',
      },
      textAera: {
        title: 'The most talked-about, futuristic product',
        tags: ['Strategy', 'AI in Finance', 'Future'],
        description:
          'Nullam id turpis non sem sodales gravida non at urna. Etiam in urna at leo imperdiet elementum. Cras imperdiet pulvinar dui, a consequat odio ornare eget.',
      },
    },
    {
      imageProps: {
        image: featured_project1,
        title: 'Finance',
        projectFrom: 'Jan',
        projectTo: 'Feb',
        year: '2023',
      },
      textAera: {
        title: 'One of the most significant applications ',
        tags: ['Strategy', 'AI in Finance', 'Future'],
        description:
          'In conclusion, the infusion of AI into the financial sector has ushered in a new era of efficiency, accuracy, and customer-centricity.',
      },
    },
    {
      imageProps: {
        image: featured_project,
        title: 'Tech',
        projectFrom: 'Jan',
        projectTo: 'Aug',
        year: '2023',
      },
      textAera: {
        title: 'The most talked-about, futuristic product',
        tags: ['Strategy', 'AI in Finance', 'Future'],
        description:
          'As in previous years, the company unveiled a feature before it was ready. The obvious question soon followed: Should AI software that’s smart enough to trick humans be forced to disclose itself.',
      },
    },
  ],
};

const SliderPill = (props: {
  active: boolean;
  itemNumber: string;
  title: string;
  projectFrom: string;
  projectTo: string;
  year: string;
}) => {
  const { active, itemNumber, title, projectFrom, projectTo, year } = props;

  const styles = {
    elementWrap: {
      border: '0.50px white solid',
      paddingLeft: '7px',
      paddingRight: '7px',
      paddingTop: '1px',
      paddingBottom: '1px',
      display: 'flex',
      alignItems: 'center',
    },
    itemNumberLable: {
      color: 'white',
      fontWeight: '400',
      textTransform: 'uppercase',
      letterSpacing: 1,
      wordWrap: 'break-word',
    },
    container: {
      marginLeft: '25px',
    },
    vr: {
      borderLeft: '1px solid white',
      height: '70px',
      marginLeft: '55%',
    },
  };

  return (
    <>
      {active ? (
        <>
          <Stack>
            <Box sx={styles.vr} />
            <Stack direction="row" sx={styles.container}>
              <Stack>
                <Box sx={styles.elementWrap}>
                  <Typography variant="overline" sx={styles.itemNumberLable}>
                    Project #{itemNumber}
                  </Typography>
                </Box>
                <Box sx={styles.elementWrap}>
                  <Typography variant="overline" sx={styles.itemNumberLable}>
                    {projectFrom} - {projectTo} {year}
                  </Typography>
                </Box>
              </Stack>
              <Box sx={styles.elementWrap}>
                <Typography variant="h4">{title}</Typography>
              </Box>
            </Stack>
          </Stack>
        </>
      ) : (
        <Stack direction="row" spacing={0} sx={styles.container}>
          <Box sx={styles.elementWrap}>
            <Typography variant="overline" sx={{ ...styles.itemNumberLable }}>
              #{itemNumber}
            </Typography>
          </Box>
          <Box sx={styles.elementWrap}>
            <Typography variant="h6">{title}</Typography>
          </Box>
        </Stack>
      )}
    </>
  );
};

export const FeaturedProjectSlider = () => {
  //TODO: move css from FeatureProjectSlider.css here...
  const [selectedItem, setSelectedItem] = useState<number>(dummyData.items.length - 1);
  return (
    <Carousel
      className={'main-carousel'}
      showThumbs={false}
      showStatus={false}
      renderIndicator={(
        clickHandler: (e: React.MouseEvent | React.KeyboardEvent) => void,
        isSelected: boolean,
        index: number,
        label: string,
      ) => renderIndicator(clickHandler, isSelected, index, label, setSelectedItem, selectedItem)}
      selectedItem={selectedItem}
      transitionTime={700}
      swipeable
      showArrows={false}
      animationHandler={fadeAnimationHandler}
    >
      {dummyData.items.map((el, id) => (
        <div key={id}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={8}>
              <Image
                src={el.imageProps.image}
                alt="Project"
                sizes="100vw"
                style={{
                  width: '100%',
                  height: '450px',
                }}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <FeaturedProjectContent
                title={el.textAera.title}
                tags={el.textAera.tags}
                description={el.textAera.description}
              />
            </Grid>
          </Grid>
        </div>
      ))}
    </Carousel>
  );
};

const FeaturedProjectContent = (props: { title: string; tags: string[]; description: string }) => {
  const { title, tags, description } = props;

  return (
    <Box sx={{ textAlign: 'left' }}>
      <Typography variant="overline">featured project</Typography>
      <Typography variant="h2">{title}</Typography>
      <Box>
        <List aria-label="tags" sx={{ display: 'inline-flex' }}>
          {tags.map((el, id) => (
            <ListItem key={id}>
              <CustomChip label={el} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Typography variant="body1">{description}</Typography>
    </Box>
  );
};

const renderIndicator = (
  clickHandler: (e: React.MouseEvent | React.KeyboardEvent) => void,
  isSelected: boolean,
  index: number,
  label: string,
  setSelectedItem: Dispatch<SetStateAction<number>>,
  selectedItem: number,
) => {
  const movePills = (newIndex: number) => {
    const elems = document.querySelectorAll('.control-dots');
    let index = 0;
    const length = elems.length;
    const moveByPx = 150;

    for (; index < length; index++) {
      const elem = elems[index] as HTMLElement;
      const old = elem.style.translate.split('px')[0];
      if (old === '0') return;

      if (selectedItem > newIndex) {
        elem.style.translate = `${Number(old) + moveByPx}px`;
      }
      if (selectedItem < newIndex) {
        elem.style.translate = `${Number(old) - moveByPx}px`;
      }
    }
  };

  const handleClick = (index: number) => {
    setSelectedItem(index);
    movePills(index);
  };
  return (
    <>
      <Box sx={{ display: 'inline-flex', cursor: 'pointer' }} onClick={() => handleClick(index)}>
        <SliderPill
          active={isSelected}
          itemNumber={(index + 1).toString()}
          title={dummyData.items[index].imageProps.title || ''}
          projectFrom={dummyData.items[index].imageProps.projectFrom || ''}
          projectTo={dummyData.items[index].imageProps.projectTo || ''}
          year={dummyData.items[index].imageProps.year || ''}
        />
      </Box>
    </>
  );
};

const fadeAnimationHandler: AnimationHandler = (props, state): AnimationHandlerResponse => {
  const transitionTime = props.transitionTime + 'ms';
  const transitionTimingFunction = 'liniar'; //'ease-in-out';

  let slideStyle: React.CSSProperties = {
    position: 'absolute',
    display: 'block',
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
