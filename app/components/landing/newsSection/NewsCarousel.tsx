import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import NewsCard from "./NewsCard";
import Grid from "@mui/material/Grid";

import avatarImg from "/public/images/avatar.png";

import ArrowControllers from "../../common/SliderArrowControllers";

const dummyNews = [
  {
    id: 1,
    title: "Just the start",
    subtitle:
      "As in previous years, the company unveiled a feature before it was ready. The obvous question soon followed.",
    theme: "AI in Finance",
    publisher: "Muster Macintosh",
    date: "12 Sep 2023",
    avatar: avatarImg,
  },
  {
    id: 2,
    title: "Something else",
    subtitle:
      "As in previous years, the company unveiled a feature before it was ready. The obvous question soon followed.",
    theme: "Thema xzy",
    publisher: "Muster Macintosh",
    date: "12 Sep 2023",
    avatar: avatarImg,
  },
  {
    id: 3,
    title: "Just the start",
    subtitle:
      "As in previous years, the company unveiled a feature before it was ready. The obvous question soon followed.",
    theme: "AI in Finance",
    publisher: "Muster Macintosh",

    date: "12 Sep 2023",
    avatar: avatarImg,
  },
  {
    id: 4,
    title: "Something else",
    subtitle:
      "As in previous years, the company unveiled a feature before it was ready. The obvous question soon followed.",
    theme: "Thema xzy",
    publisher: "Muster Macintosh",
    date: "12 Sep 2023",
    avatar: avatarImg,
  },
  {
    id: 5,
    title: "Just the start",
    subtitle:
      "As in previous years, the company unveiled a feature before it was ready. The obvous question soon followed.",
    theme: "AI in Finance",
    publisher: "Muster Macintosh",
    date: "12 Sep 2023",
    avatar: avatarImg,
  },
  {
    id: 6,
    title: "Something else",
    subtitle:
      "As in previous years, the company unveiled a feature before it was ready. The obvous question soon followed.",
    theme: "Thema xzy",
    publisher: "Muster Macintosh",
    date: "12 Sep 2023",
    avatar: avatarImg,
  },
];

export default function NewsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Grid container item xs={12} spacing={2}>
      <Carousel
        className={"carousel"}
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
        centerSlidePercentage={30}
        onChange={(slide) => setCurrentSlide(slide)}
      >
        {dummyNews.map((item) => (
          <Grid item xs={11} key={item.id}>
            <NewsCard
              title={item.title}
              subtitle={item.subtitle}
              theme={item.theme}
              publisher={item.publisher}
              avatar={item.avatar}
              date={item.date}
            />
          </Grid>
        ))}
      </Carousel>
      <ArrowControllers
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        slidesLength={dummyNews.length - 1}
      />
    </Grid>
  );
}
