import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import Typography from "@mui/material/Typography";
import ProjectCard from "./ProjectCard";
import Grid from "@mui/material/Grid";
import ArrowRightIcon from "@mui/icons-material/ArrowForward";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";

import project1 from "../../../assets/images/project1.png";
import project2 from "../../../assets/images/project2.png";
import project3 from "../../../assets/images/project3.png";

import { PROJECT_PROGRESS } from "./ProgressStepper";
import CustomButton from "@/components/common/CustomButton";
import Button from "@mui/material/Button";

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

function ArrowControllers() {
  return (
    <Grid container xs={2}>
      <Grid item xs={6}>
        <Button startIcon={<ArrowLeftIcon />} />
      </Grid>
      <Grid item xs={6}>
        <Button startIcon={<ArrowRightIcon />} />
      </Grid>
    </Grid>
  );
}

export const ProjectSection = () => {
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
      <Grid container item xs={12} spacing={2}>
        <Carousel
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
          transitionTime={350}
          swipeable
          useKeyboardArrows
          centerMode
          centerSlidePercentage={40}
        >
          {dummyProjects.map((item) => (
            <div key={item.id}>
              <Grid item xs={11}>
                <ProjectCard
                  img={item.img}
                  contributors={item.contributors}
                  progress={item.progress}
                />
              </Grid>
            </div>
          ))}
        </Carousel>
      </Grid>
    </Grid>
  );
};
