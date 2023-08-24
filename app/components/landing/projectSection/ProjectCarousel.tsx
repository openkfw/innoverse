import { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';

import Grid from '@mui/material/Grid';

import ArrowControllers from './ArrowControllers';
import ProjectCard from './ProjectCard';

import 'react-responsive-carousel/lib/styles/carousel.min.css';

import project1 from '/public/images/project1.png';
import project2 from '/public/images/project2.png';
import project3 from '/public/images/project3.png';

const PROJECT_PROGRESS = {
  EXPLORATION: 'Exploration',
  KONZEPTION: 'Konzeption',
  PROOF_OF_CONCEPT: 'Proof of Concept',
};

const dummyProjects = [
  {
    id: 1,
    img: project1,
    contributors: ['Max Muster', 'Lisa Laimberger', 'Bernhard Brunner'],
    progress: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
  },
  {
    id: 2,
    img: project2,
    contributors: ['Max Muster', 'Lisa Laimberger'],
    progress: PROJECT_PROGRESS.KONZEPTION,
  },
  {
    id: 3,
    img: project3,
    contributors: ['Max Muster', 'Lisa Laimberger', 'Bernhard Brunner'],
    progress: PROJECT_PROGRESS.KONZEPTION,
  },
  {
    id: 4,
    img: project1,
    contributors: ['Max Muster', 'Lisa Laimberger', 'Bernhard Brunner'],
    progress: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
  },
  {
    id: 5,
    img: project2,
    contributors: ['Max Muster', 'Lisa Laimberger'],
    progress: PROJECT_PROGRESS.KONZEPTION,
  },
  {
    id: 6,
    img: project3,
    contributors: ['Max Muster', 'Lisa Laimberger', 'Bernhard Brunner'],
    progress: PROJECT_PROGRESS.KONZEPTION,
  },
];

export default function ProjectCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Grid container item xs={12} spacing={2}>
      <Carousel
        swipeable
        emulateTouch
        useKeyboardArrows
        centerMode
        selectedItem={currentSlide}
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        showArrows={false}
        transitionTime={600}
        centerSlidePercentage={40}
        onChange={(slide) => setCurrentSlide(slide)}
      >
        {dummyProjects.map((item) => (
          <Grid item xs={11} key={item.id}>
            <ProjectCard img={item.img} contributors={item.contributors} />
          </Grid>
        ))}
      </Carousel>
      <ArrowControllers
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        slidesLength={dummyProjects.length - 1}
      />
    </Grid>
  );
}
