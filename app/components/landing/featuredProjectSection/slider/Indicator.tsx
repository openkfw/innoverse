'use client';

import Box from '@mui/material/Box';

import { Project } from '@/common/types';
import theme from '@/styles/theme';

import SliderPill from './SliderPill';

interface IndicatorProps {
  isSelected: boolean;
  index: number;
  setSelectedItem: (index: number) => void;
  slide: Project;
}

const Indicator = (props: IndicatorProps) => {
  const { setSelectedItem, slide, index, isSelected } = props;

  const handleClick = (index: number) => {
    setSelectedItem(index);
  };

  return (
    <Box sx={indicatorStyles} onClick={() => handleClick(index)}>
      <SliderPill
        active={isSelected}
        itemNumber={(index + 1).toString()}
        title={slide.shortTitle || ''}
        projectStart={slide.projectStart || ''}
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
