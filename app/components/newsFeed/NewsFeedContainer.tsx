'use client';

import { PropsWithChildren, useState } from 'react';

import FilterIcon from '@mui/icons-material/FilterAlt';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useNewsFeed } from '@/app/contexts/news-feed-context';
import { Option } from '@/common/formTypes';
import InteractionButton, { interactionButtonStyles, InteractionType } from '@/components/common/InteractionButton';
import SecondaryIconButton from '@/components/common/SecondaryIconButton';
import NewsFeedFilter from '@/components/newsFeed/NewsFeedFilter';
import AddPostDialog from '@/components/newsPage/addPost/AddPostDialog';
import MobileNewsFilter from '@/components/newsPage/newsFilter/MobileNewsFilter';
import theme from '@/styles/theme';
import { getProjectsOptions } from '@/utils/requests/project/requests';

import { EditingContextProvider } from '../common/editing/editing-context';

export default function NewsFeedContainer({ children }: PropsWithChildren) {
  const [addUpdateDialogOpen, setAddUpdateDialogOpen] = useState(false);
  const [projectOptions, setProjectOptions] = useState<Option[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { refetchFeed } = useNewsFeed();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleAddUpdate = async () => {
    const projectOptions = await getProjectsOptions();
    setProjectOptions(projectOptions);
    setAddUpdateDialogOpen(true);
  };

  return (
    <EditingContextProvider>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={3}>
          <Box display="flex" flexDirection="column">
            <Card sx={cardStyles}>
              <Typography variant="h2" sx={cardTitleStyles}>
                News
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 1, fontSize: 16 }}>
                Alle Neuigkeiten im Überblick: Aktuelle Nachrichten, neue Projekte und alle Ereignisse.
              </Typography>
            </Card>

            <InteractionButton
              onClick={handleAddUpdate}
              interactionType={InteractionType.ADD_UPDATE}
              sx={{ ...interactionButtonStyles, ...buttonStyles }}
            />

            {isSmallScreen && (
              <Grid item>
                <SecondaryIconButton
                  label="Filters"
                  icon={<FilterIcon sx={{ color: 'secondary.main' }} />}
                  onClick={() => setDrawerOpen(true)}
                />
              </Grid>
            )}
            {isSmallScreen ? <MobileNewsFilter open={drawerOpen} setOpen={setDrawerOpen} /> : <NewsFeedFilter />}
          </Box>
        </Grid>
        <Grid item xs={12} md={8} lg={8}>
          {children}
        </Grid>
      </Grid>
      <AddPostDialog
        open={addUpdateDialogOpen}
        setOpen={setAddUpdateDialogOpen}
        refetchUpdates={refetchFeed}
        projectOptions={projectOptions}
      />
    </EditingContextProvider>
  );
}
const cardStyles = {
  px: 3,
  py: 4,
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.20)',
  backgroundColor: 'rgba(255, 255, 255, 0.10)',
  boxShadow: '0px 12px 40px 0px rgba(0, 0, 0, 0.25)',
  backdropFilter: 'blur(20px)',
};

const cardTitleStyles = {
  fontSize: '48px',
};

const buttonStyles = {
  my: 4,
  px: '24px',
  py: '8px',
  height: '48px',
  border: '2px solid rgba(255, 255, 255, 0.40)',
};
