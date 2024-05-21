import { useState } from 'react';
import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { ProjectUpdate } from '@/common/types';
import AllUpdatesIcon from '@/components/icons/AllUpdatesIcon';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import theme from '@/styles/theme';
import { formatDate } from '@/utils/helpers';

import AvatarIcon from '../common/AvatarIcon';
import { parseStringForLinks } from '../common/LinkString';
import { StyledTooltip } from '../common/StyledTooltip';

import { TooltipContent } from './TooltipContent';

interface UpdateCardProps {
  updates: ProjectUpdate[];
}

const UpdateCard = (props: UpdateCardProps) => {
  const { updates } = props;
  const [currentIndex, setCurrentIndex] = useState(0);

  const previousDisabled = currentIndex === 0;
  const nextDisabled = currentIndex === updates.length - 1;
  const progress = `${currentIndex + 1}/${updates.length}`;
  const update = updates[currentIndex];
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const MAX_LENGTH = isSmallScreen ? 350 : 160;

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
    const newUrl = `${window.location.pathname}?tab=2`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    setTimeout(() => {
      const section = document.getElementById('updates-tab');
      if (section) {
        window.scrollTo({
          top: section.offsetTop - offset,
          behavior: 'smooth',
        });
      }
    }, 0);
  }

  if (updates.length === 0) {
    return <></>;
  }

  function readMore() {
    const newUrl = `${window.location.pathname}?tab=2`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    setTimeout(() => {
      const scroll = () => {
        const section = document.getElementById('updates-tab')?.offsetTop;
        if (section) {
          window.scrollTo({
            top: section,
            behavior: 'smooth',
          });
        }
      };

      scroll();
    }, 100);
  }

  function showText() {
    return update?.comment.length > MAX_LENGTH
      ? parseStringForLinks(update?.comment.slice(0, MAX_LENGTH))
      : parseStringForLinks(update?.comment);
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
          <Box>
            <Typography
              variant="body1"
              sx={{ color: 'rgba(0, 0, 0, 0.87)', marginTop: 1, marginBottom: 1, display: 'inline' }}
            >
              {showText()}
              {update.linkToCollaborationTab && (
                <Link style={linkStyles} href={`/projects/${update.projectId}?tab=1#moredetails`}>
                  {' '}
                  Mehr erfahren
                </Link>
              )}
            </Typography>

            {update?.comment.length > MAX_LENGTH && (
              <Typography
                variant="subtitle2"
                onClick={readMore}
                sx={{ ...buttonOverlayStyle, display: 'inline', cursor: 'pointer' }}
              >
                ... alles anzeigen
              </Typography>
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {formatDate(update?.updatedAt)}
          </Typography>

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

  '&:hover': {
    border: '1px solid rgba(255, 255, 255, 0.40)',
  },
};

const typographyStyles = {
  color: 'rgba(0, 0, 0, 0.56)',
};

const buttonOverlayStyle = {
  background: '#ffffff',
  color: theme.palette.primary.main,
  ':hover': {
    background: '#ffffff',
    color: theme.palette.primary.main,
  },
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  boxShadow: '-10px 0 10px white',
  width: '130px',
};

const linkStyles = {
  textDecoration: 'none',
  cursor: 'pointer',
  color: theme.palette.primary.main,
};
