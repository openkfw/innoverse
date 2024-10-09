import React, { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

import CustomButton from '../CustomButton';

interface DiscardAddPostDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DiscardAddPostDialog = ({ open, onConfirm, onCancel }: DiscardAddPostDialogProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(5px)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          border: '1px solid rgba(0, 90, 140, 0.20)',
          background: '#FFFFFF',
          boxShadow:
            '0px 4px 26px 3px rgba(0, 0, 0, 0.12), 0px 10px 22px 1px rgba(0, 0, 0, 0.14), 0px 6px 6px -3px rgba(0, 0, 0, 0.05)',
          width: 'auto',
        },
      }}
    >
      <ClickAwayListener onClickAway={onCancel}>
        <Box sx={containerStyle}>
          <CloseIcon onClick={onCancel} sx={closeIconStyle} />
          <Typography variant="body2" color="text.primary" sx={textStyle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              style={{ marginRight: '8px', verticalAlign: 'text-bottom' }}
            >
              <path
                d="M14 17.22H2V5H9V3H2C0.9 3 0 3.9 0 5V17C0 18.1 0.9 19 2 19H14C15.1 19 16 18.1 16 17V10H14V17.22Z"
                fill="#41484C"
              />
              <path
                d="M16 0H14V3H11C11.01 3.01 11 5 11 5H14V7.99C14.01 8 16 7.99 16 7.99V5H19V3H16V0Z"
                fill="#41484C"
              />
              <path d="M12 7H4V9H12V7Z" fill="#41484C" />
              <path d="M4 10V12H12V10H9H4Z" fill="#41484C" />
              <path d="M12 13H4V15H12V13Z" fill="#41484C" />
            </svg>
            {m.components_common_editing_discardAddPostDialog_discardAddPost()}
          </Typography>
          <Stack direction={'row'} alignItems={'flex-start'} gap={'8px'} flexWrap={'wrap'}>
            <CustomButton themeVariant="secondary" endIcon={null} onClick={onCancel} sx={buttonStyle}>
              {m.components_common_editing_discardAddPostDialog_discard()}
            </CustomButton>
            <CustomButton
              themeVariant="secondary"
              startIcon={null}
              endIcon={null}
              onClick={onConfirm}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              sx={{
                ...buttonStyle,
                backgroundColor: '#B7F9AA',
              }}
            >
              {m.components_common_editing_discardAddPostDialog_continue()}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                style={{ marginLeft: '8px' }}
              >
                <path
                  d="M0 18.0001H3.75L14.81 6.94006L11.06 3.19006L0 14.2501V18.0001ZM2 15.0801L11.06 6.02006L11.98 6.94006L2.92 16.0001H2V15.0801Z"
                  fill={isHovered ? 'white' : '#41484C'}
                />
                <path
                  d="M15.3709 0.290059C14.9809 -0.0999414 14.3509 -0.0999414 13.9609 0.290059L12.1309 2.12006L15.8809 5.87006L17.7109 4.04006C18.1009 3.65006 18.1009 3.02006 17.7109 2.63006L15.3709 0.290059Z"
                  fill={isHovered ? 'white' : '#41484C'}
                />
              </svg>
            </CustomButton>
          </Stack>
        </Box>
      </ClickAwayListener>
    </Dialog>
  );
};

const containerStyle: SxProps = {
  p: { xs: 2, sm: 4 },
  width: '760px',
  maxWidth: '100%',
};

const textStyle: SxProps = {
  mb: { xs: 2, sm: 3 },
  fontWeight: '700',
  lineHeight: '175%',
};

const buttonStyle: SxProps = {
  width: { xs: 'auto', sm: 'fit-content' },
  px: { xs: '13px', sm: '24px' },
  height: '48px',
  fontSize: '20px',
  border: '2px solid #ECFDED',
  color: '#41484C',
  '&:hover': { border: '2px solid rgba(255, 255, 255, 0.40)' },
};

const closeIconStyle: SxProps = {
  cursor: 'pointer',
  position: 'absolute',
  right: '14px',
  top: '14px',
  marginTop: '5px',
  color: 'rgba(0, 0, 0, 0.56)',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
};
