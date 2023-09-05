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

import { SliderContent, sliderContent } from '@/repository/mock/landing/main-slider';

import CustomChip from '../../common/CustomChip';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './FeatureProjectSlider.css';

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
  const [selectedItem, setSelectedItem] = useState<number>(sliderContent.items.length - 1);
  const [slides] = useState<SliderContent>(sliderContent);
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
      ) => renderIndicator(clickHandler, isSelected, index, label, setSelectedItem, selectedItem, slides)}
      selectedItem={selectedItem}
      transitionTime={700}
      swipeable
      showArrows={false}
      animationHandler={fadeAnimationHandler}
    >
      {slides.items.map((el, id) => (
        <div key={id}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={8}>
              <Image
                src={el.image.image}
                alt="Project"
                sizes="100vw"
                style={{
                  width: '100%',
                  height: '450px',
                }}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <FeaturedProjectContent title={el.text.title} tags={el.text.tags} description={el.text.description} />
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
  slides: SliderContent,
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
          title={slides.items[index].image.title || ''}
          projectFrom={slides.items[index].image.projectFrom || ''}
          projectTo={slides.items[index].image.projectTo || ''}
          year={slides.items[index].image.year || ''}
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
