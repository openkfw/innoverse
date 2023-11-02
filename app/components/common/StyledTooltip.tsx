import { styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';

export const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
    '&:before': {
      border: '1px solid rgba(0, 90, 140, 0.20)',
    },
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow:
      '0px 6px 6px -3px rgba(0, 0, 0, 0.05), 0px 10px 22px 1px rgba(0, 0, 0, 0.14), 0px 4px 26px 3px rgba(0, 0, 0, 0.12)',
    borderRadius: '16px',
    border: '1px solid rgba(0, 90, 140, 0.20)',
    maxWidth: 'none',
  },
}));
