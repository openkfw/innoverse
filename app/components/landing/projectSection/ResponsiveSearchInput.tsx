'use client';

import { ChangeEvent, useState } from 'react';

import FilterIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import type { Theme } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { closeIconButtonStyle } from '@/components/common/CustomDialog';
import SecondaryIconButton from '@/components/common/SecondaryIconButton';
import CloseIcon from '@/components/icons/CloseIcon';
import ApplyFilterButton, { APPLY_BUTTON } from '@/components/newsPage/newsFilter/ApplyFilterButton';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

type SearchInputProps = { onChange: (event: ChangeEvent<HTMLInputElement>) => void };

export const ResponsiveSearchInput = (props: SearchInputProps) => {
  const isWideScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  return isWideScreen ? <FullSearchInput {...props} /> : <MobileSearchInput {...props} />;
};

const FullSearchInput = ({ onChange }: SearchInputProps) => (
  <FormControl variant="standard" sx={{ width: '100%' }}>
    <TextField
      onChange={onChange}
      variant="outlined"
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'white',
          },
          '&:hover fieldset': {
            borderColor: 'white',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'white',
          },
          '& input': {
            color: 'white',
          },
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: 'white' }} />
          </InputAdornment>
        ),
      }}
      inputProps={{
        'aria-label': 'Search field',
      }}
    />
  </FormControl>
);

const MobileSearchInput = ({ onChange }: SearchInputProps) => {
  const [open, setOpen] = useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  return (
    <>
      <SecondaryIconButton
        label={m.components_newsFeed_newsFeedContainer_filter()}
        icon={<FilterIcon sx={{ color: 'secondary.main' }} />}
        onClick={openDrawer}
      />
      <SwipeableDrawer
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'transparent',
            height: 'calc(100% - 200px)',
          },
        }}
        anchor="bottom"
        open={open}
        onClose={closeDrawer}
        onOpen={openDrawer}
      >
        <Box mr="15px" display="flex" justifyContent="flex-end" alignItems="flex-end">
          <IconButton onClick={closeDrawer} sx={closeIconButtonStyle}>
            <CloseIcon color={theme.palette.text.primary} />
          </IconButton>
        </Box>

        <Box sx={drawerBoxStyle}>
          <Typography variant="overline">Filtern</Typography>
          <FullSearchInput onChange={onChange} />
        </Box>

        <ApplyFilterButton onClick={closeDrawer} applyButtonType={APPLY_BUTTON.ENABLED} />
      </SwipeableDrawer>
    </>
  );
};

const drawerBoxStyle = {
  overflow: 'scroll',
  p: 3,
  m: 3,
  borderRadius: '16px',
  border: '1px solid rgba(0, 90, 140, 0.20)',
  backgroundColor: 'primary.light',
};
