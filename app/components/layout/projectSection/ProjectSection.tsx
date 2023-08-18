import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import Typography from "@mui/material/Typography";
import ProjectCard from "./ProjectCard";
import Grid from "@mui/material/Grid";

import project1 from "../../../assets/images/project1.png";
import project2 from "../../../assets/images/project2.png";
import project3 from "../../../assets/images/project3.png";

import { PROJECT_PROGRESS } from "./ProgressStepper";
import CustomButton from "@/components/common/CustomButton";
import ArrowControllers from "./ArrowControllers";

const dummyProjects = [
  {
    id: 1,
    img: project1,
    contributors: ["Max Muster", "Lisa Laimberger", "Bernhard Brunner"],
    progress: PROJECT_PROGRESS.PROOF_OF_CONCEPT,
  },
  {
    id: 2,
    img: project2,
    contributors: ["Max Muster", "Lisa Laimberger"],
    progress: PROJECT_PROGRESS.KONZEPTION,
  },
  {
    id: 3,
    img: project3,
    contributors: ["Max Muster", "Lisa Laimberger", "Bernhard Brunner"],
    progress: PROJECT_PROGRESS.KONZEPTION,
  },
];

export const ProjectSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Grid container spacing={4} sx={{ m: 5 }}>
      <Grid item container xs={12}>
        <Grid item xs={9}>
          <Typography variant="overline">current project</Typography>
          <Typography variant="h2">Title projects here</Typography>
        </Grid>
        <Grid item xs={3} sx={{ mt: 6 }}>
          <CustomButton>See all projects</CustomButton>
        </Grid>
      </Grid>
      {/* TODO: move the carousel to separate file */}
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
          transitionTime={350}
          centerSlidePercentage={40}
        >
          {dummyProjects.map((item) => (
            <Grid item xs={11} key={item.id}>
              <ProjectCard
                img={item.img}
                contributors={item.contributors}
                progress={item.progress}
              />
            </Grid>
          ))}
        </Carousel>
        <ArrowControllers
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          slidesLength={dummyProjects.length - 1}
        />
      </Grid>
    </Grid>
  );
};
