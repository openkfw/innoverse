import { useState } from 'react';

import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';

import { ProjectUpdate } from '@/common/types';
import AllUpdatesIcon from '@/components/icons/AllUpdatesIcon';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import theme from '@/styles/theme';

import AvatarIcon from '../common/AvatarIcon';
import { parseStringForLinks } from '../common/LinkString';

interface UpdateCardProps {
  updates: ProjectUpdate[];
  setActiveTab: (tab: number) => void;
}

const UpdateCard = (props: UpdateCardProps) => {
  const { updates, setActiveTab } = props;
  const [currentIndex, setCurrentIndex] = useState(0);

  const previousDisabled = currentIndex === 0;
  const nextDisabled = currentIndex === updates.length - 1;
  const progress = `${currentIndex + 1}/${updates.length}`;
  const update = updates[currentIndex];

  function showPrevious() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  function showNext() {
    if (currentIndex < updates.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function handleUpdatesClick(offset: number) {
    const scroll = () => {
      const section = document.getElementById('updates-tab')?.offsetTop;
      if (section) {
        window.scrollTo({
          top: section - offset,
          behavior: 'smooth',
        });
      }
    };

    setActiveTab(2);
    setTimeout(scroll, 0);
  }

  if (updates.length === 0) {
    return <></>;
  }

  return (
    <>
      <Typography variant="overline" sx={titleStyles}>
        Neueste Updates
      </Typography>

      <Card sx={cardStyles} elevation={0}>
        <CardContent>
          <Grid container alignItems="center">
            <Grid item>
              <AvatarIcon user={update?.author} size={24} />
            </Grid>
            <Grid item sx={authorStyles}>
              <Typography variant="caption" sx={{ color: 'text.primary', fontSize: 16 }}>
                {update?.author?.name}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">
                {update?.author?.role}
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.87)', marginTop: 1, marginBottom: 1 }}>
            {parseStringForLinks(update?.comment)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {update?.date}
          </Typography>

          <Box sx={footerStyles}>
            <Button sx={buttonStyles} startIcon={<AllUpdatesIcon />} onClick={() => handleUpdatesClick(125)}>
              <Typography sx={typographyStyles}>Alle Updates</Typography>
            </Button>

            <Box sx={navigationStyles}>
              <Box onClick={showPrevious} sx={iconStyles}>
                <ArrowLeftIcon disabled={previousDisabled} />
              </Box>
              <Typography color="text.secondary">{progress}</Typography>
              <Box onClick={showNext} sx={iconStyles}>
                <ArrowRightIcon disabled={nextDisabled} />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default UpdateCard;

// Update Card Styles
const titleStyles = {
  textAlign: 'center',
  color: 'primary.light',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
};

const cardStyles = {
  borderRadius: '8px',
  border: '1px solid rgba(0, 90, 140, 0.10)',
  background: 'rgba(240, 238, 225, 0.10)',
  width: '369px',
  position: 'relative',
  minHeight: '250px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: '411px',
  },
};

const authorStyles = {
  marginLeft: 1,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: 1,
};

const footerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'absolute',
  bottom: 0,
  left: 0,
  padding: '0 16px 24px 16px',
  width: '100%',
};

const navigationStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
  gap: '4px',
  margin: 0,
  padding: 0,
};

const iconStyles = {
  cursor: 'pointer',
  margin: 0,
  padding: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
};

const buttonStyles = {
  backgroundColor: 'white',
  height: '35px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  borderRadius: '48px',
  border: '1px solid rgba(0, 0, 0, 0.10)',
  backdropFilter: 'blur(24px)',
};

const typographyStyles = {
  color: 'rgba(0, 0, 0, 0.56)',
  fontFamily: 'Arial',
  fontSize: '13px',
  fontStyle: 'normal',
  fontWeight: 700,
  lineHeight: '19px',
};
