import { MutableRefObject, useRef, useState } from 'react';
import Slider from 'react-slick';

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Project } from '@/common/types';

import CollaborationColumn from './CollaborationColumn';
import ProjectStageCard from './ProjectStageCard';
import TeamMembersColumn from './TeamMembersColumn';
import UpdateCard from './UpdateCard';

interface ProjectInfoProps {
  project: Project;
}

interface SliderNavigationProps {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  sliderRef: MutableRefObject<Slider | null>;
}

const SliderNavigation = (props: SliderNavigationProps) => {
  const { sliderRef, activeIndex } = props;
  const navRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: string) => {
    const scrollAmount = direction === 'left' ? -150 : 150;
    if (navRef.current) {
      navRef.current.scrollLeft += scrollAmount;
    }
  };

  const swipe = (index: number) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  return (
    <Box sx={navigationWrapperStyles}>
      <IconButton onClick={() => scroll('left')} sx={{ marginLeft: '-25px' }}>
        <ArrowBackOutlinedIcon />
      </IconButton>

      <Box ref={navRef} style={navigationStyles}>
        {['Info', 'Team', 'Zusammenarbeit', 'Updates'].map((item, index) => (
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
  const sliderRef = useRef<Slider | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const { project } = props;

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
    beforeChange: (_: number, next: number) => setActiveIndex(next),
  };

  return (
    <>
      <SliderNavigation activeIndex={activeIndex} setActiveIndex={setActiveIndex} sliderRef={sliderRef} />
      <Box sx={sliderBoxStyles}>
        <Slider {...settings} ref={sliderRef}>
          <ProjectStageCard project={project} />
          <TeamMembersColumn team={project.team} projectName={project.title} />
          <CollaborationColumn project={project} />
          <UpdateCard updates={project?.updates} />
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
  alignSelf: 'center',
  ':hover': {
    backgroundColor: '#EBEBEB',
    cursor: 'pointer',
  },
};
