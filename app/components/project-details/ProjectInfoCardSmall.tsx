import { SetStateAction, useRef, useState } from 'react';
import Slider from 'react-slick';

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { Box, IconButton, Typography } from '@mui/material';

import { Project } from '@/common/types';

import CollaborationColumn from './CollaborationColumn';
import ProjectStageCard from './ProjectStageCard';
import TeamMembersColumn from './TeamMembersColumn';
import UpdateCard from './UpdateCard';

interface ProjectInfoProps {
  project: Project;
  setActiveTab: (tab: number) => void;
}

interface SliderNavigationProps {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  sliderRef: any;
}

const SLiderNavigation = (props: SliderNavigationProps) => {
  const { sliderRef, activeIndex } = props;
  const navRef = useRef<any>(null);

  const scroll = (direction: string) => {
    const scrollAmount = direction === 'left' ? -150 : 150;
    navRef.current.scrollLeft += scrollAmount;
  };

  const swipe = (index: number) => {
    if (sliderRef?.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  return (
    <Box sx={navigationWrapperStyles}>
      <IconButton onClick={() => scroll('left')} sx={{ marginLeft: '-25px' }}>
        <ArrowBackOutlinedIcon />
      </IconButton>

      <Box ref={navRef} style={navigationStyles}>
        {['Info & Status der Initiative', 'Unser Team', 'Zusammenarbeit', 'Neueste Updates'].map((item, index) => (
          <Typography
            key={index}
            variant="overline"
            sx={{ ...navigationItemStyles, backgroundColor: index === activeIndex ? '#EBEBEB' : 'transparent' }}
            onClick={() => swipe(index)}
          >
            {item}
          </Typography>
        ))}
      </Box>

      <IconButton onClick={() => scroll('right')} sx={{ marginRight: '-25px' }}>
        <ArrowForwardOutlinedIcon />
      </IconButton>
    </Box>
  );
};

export function ProjectInfoCardSmall(props: ProjectInfoProps) {
  const sliderRef = useRef<any>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const { project, setActiveTab } = props;

  const settings = {
    arrows: false,
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: false,
    variableWidth: false,
    rows: 1,
    beforeChange: (_: any, next: SetStateAction<number>) => setActiveIndex(next),
  };

  return (
    <>
      <SLiderNavigation activeIndex={activeIndex} setActiveIndex={setActiveIndex} sliderRef={sliderRef} />
      <Box sx={sliderBoxStyles}>
        <Slider {...settings} ref={sliderRef}>
          <ProjectStageCard setActiveTab={setActiveTab} project={project} />
          <TeamMembersColumn team={project.team} projectName={project.title} />
          <CollaborationColumn setActiveTab={setActiveTab} project={project} />
          <UpdateCard updates={project?.updates} setActiveTab={setActiveTab} />
        </Slider>
      </Box>
    </>
  );
}

// Project Info Card Small Screen Styles
const sliderBoxStyles = {
  paddingTop: 3,
  width: '100%',
  overflow: 'hidden',
  '& .slick-list': {
    touchAction: 'pan-y',
  },
  '& .slick-slide': {},
  '& .slick-track': {
    touchAction: 'pan-y',
  },
};

const navigationWrapperStyles = {
  display: 'flex',
};

const navigationStyles = {
  display: 'flex',
  justifyContent: 'flex-start',
  marginBottom: '24px',
  gap: '16px',
  width: '100%',
  overflow: 'auto',
  whiteSpace: 'nowrap',
  scroll: 'auto',
  margin: 0,
  padding: 0,
};

const navigationItemStyles = {
  color: 'primary.light',
  borderRadius: '48px',
  display: 'flex',
  padding: '0px 16px',
  ':hover': {
    backgroundColor: '#EBEBEB',
    cursor: 'pointer',
  },
};
