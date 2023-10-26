import Box from '@mui/material/Box';

import { Project } from '@/common/types';
import theme from '@/styles/theme';

import SliderPill from './SliderPill';

interface IndicatorProps {
  isSelected: boolean;
  index: number;
  setSelectedItem: (index: number) => void;
  selectedItem: number;
  slide: Project;
}

const Indicator = (props: IndicatorProps) => {
  const { selectedItem, setSelectedItem, slide, index, isSelected } = props;
  const movePills = (newIndex: number) => {
    const slider = document.querySelectorAll('.slick-dots.slick-thumb')[0] as HTMLElement;
    const old = Number(slider.style.translate.split('px')[0]);
    const diff = Math.abs(selectedItem - newIndex);
    const moveByPx = diff * 150;

    if (selectedItem > newIndex) {
      slider.style.translate = `${old + moveByPx}px`;
    }
    if (selectedItem < newIndex) {
      slider.style.translate = `${old - moveByPx}px`;
    }
  };

  const handleClick = (index: number) => {
    setSelectedItem(index);
    movePills(index);
  };
  return (
    <Box sx={indicatorStyles} onClick={() => handleClick(index)}>
      <SliderPill
        active={isSelected}
        itemNumber={(index + 1).toString()}
        title={slide.title || ''}
        projectStart={slide.projectStart || ''}
        projectEnd={slide.projectEnd || 'Present'}
      />
    </Box>
  );
};

export default Indicator;

// Indicator styles
const indicatorStyles = {
  display: 'inline-flex',
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
};
