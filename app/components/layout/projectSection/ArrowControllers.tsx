import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ArrowRightIcon from "@mui/icons-material/ArrowForward";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";

interface ArrowControllersProps {
  currentSlide: number;
  // TODO: fix any
  setCurrentSlide: any;
  slidesLength: number;
}

export default function ArrowControllers(props: ArrowControllersProps) {
  const { currentSlide, setCurrentSlide, slidesLength } = props;

  const iconStyles = {
    color: "common.white",
    "&:disabled": {
      color: "common.white",
      opacity: 0.5,
    },
  };

  const next = () => {
    if (currentSlide != slidesLength) {
      setCurrentSlide((prevState: number) => prevState + 1);
    }
  };

  const prev = () => {
    if (currentSlide != 0) {
      setCurrentSlide((prevState: number) => prevState - 1);
    }
  };

  return (
    <Grid item container xs={2}>
      <Grid item xs={5}>
        <IconButton disabled={currentSlide == 0} onClick={prev} sx={iconStyles}>
          <ArrowLeftIcon style={{ fontSize: 40 }} />
        </IconButton>
      </Grid>
      <Grid item xs={5}>
        <IconButton
          disabled={currentSlide == slidesLength}
          onClick={next}
          sx={iconStyles}
        >
          <ArrowRightIcon style={{ fontSize: 40 }} />
        </IconButton>
      </Grid>
    </Grid>
  );
}
