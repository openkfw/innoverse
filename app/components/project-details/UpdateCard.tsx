import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { ProjectUpdate } from '@/common/types';
import AllUpdatesIcon from '@/components/icons/AllUpdatesIcon';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import theme from '@/styles/theme';

import AvatarIcon from '../common/AvatarIcon';
import { parseStringForLinks } from '../common/LinkString';
import { StyledTooltip } from '../common/StyledTooltip';

import { TooltipContent } from './TooltipContent';

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
            <Box>
              <StyledTooltip
                arrow
                key={update?.id}
                title={<TooltipContent teamMember={update?.author} />}
                placement="bottom"
              >
                <AvatarIcon user={update?.author} size={24} allowAnimation index={100} />
              </StyledTooltip>
            </Box>
            <Box sx={{ paddingLeft: '16px', ml: '8px' }}>
              <Typography variant="subtitle2" sx={authorNameStyles}>
                {update?.author?.name}
              </Typography>

              <Typography variant="subtitle2" sx={authorRoleStyles}>
                {update?.author?.role}
              </Typography>
            </Box>
          </Grid>
          <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.87)', marginTop: 1, marginBottom: 1 }}>
            {parseStringForLinks(update?.comment)}
          </Typography>
          {update?.date && (
            <Typography variant="caption" color="text.secondary">
              {update.date.toString()}
            </Typography>
          )}

          <Box sx={footerStyles}>
            <Button sx={buttonStyles} startIcon={<AllUpdatesIcon />} onClick={() => handleUpdatesClick(125)}>
              <Typography variant="button" sx={typographyStyles}>
                Alle Updates
              </Typography>
            </Button>

            <Box sx={navigationStyles}>
              <Box onClick={showPrevious} sx={iconStyles}>
                <ArrowLeftIcon disabled={previousDisabled} />
              </Box>
              <Box>
                <Typography variant="caption" color="#6D767D">
                  {progress}
                </Typography>
              </Box>
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
  maxWidth: '100%',
  position: 'relative',
  minHeight: '250px',
  mt: 2,
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: '411px',
  },
};

const authorNameStyles = {
  color: 'text.primary',
  fontSize: '14px',
  lineHeight: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'wrap',
  maxWidth: '23ch',
};

const authorRoleStyles = {
  color: 'text.secondary',
  fontSize: '14px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'wrap',
  maxWidth: '23ch',
  lineHeight: '150%',
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
  alignItems: 'center',
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
  borderRadius: '48px',
  padding: '5px 18px',
  border: '1px solid rgba(0, 0, 0, 0.10)',
  backdropFilter: 'blur(24px)',
};

const typographyStyles = {
  color: 'rgba(0, 0, 0, 0.56)',
};
