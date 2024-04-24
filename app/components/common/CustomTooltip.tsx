import React, { ReactElement } from 'react';

import { StyledTooltip } from './StyledTooltip';

interface CustomTooltipProps {
  children: ReactElement;
  tooltip: string;
  placement?:
    | 'bottom-end'
    | 'bottom'
    | 'bottom-start'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
  arrow?: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ children, tooltip, placement = 'top', arrow = true }) => {
  return (
    <StyledTooltip arrow={arrow} title={tooltip} placement={placement} sx={tooltipStyles}>
      {children}
    </StyledTooltip>
  );
};

export default CustomTooltip;

// Custom Tooltip Styles
const tooltipStyles = {
  '.MuiTooltip-tooltip': {
    borderRadius: '4px',
    color: '#41484C',
    background: '#D4FCCA',
    display: 'flex',
    padding: '4px 8px',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
  },

  '.MuiTooltip-arrow': {
    color: '#D4FCCA',
    '&::before': {
      backgroundColor: '#D4FCCA',
      border: 'none',
    },
  },
};
