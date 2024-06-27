'use client';

import { PropsWithChildren, useState } from 'react';

import FilterIcon from '@mui/icons-material/FilterAlt';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useNewsFeed } from '@/app/contexts/news-feed-context';
import { Option } from '@/common/formTypes';
import { NewsFeedEntry, ObjectType, Post, ProjectUpdate } from '@/common/types';
import { UnsavedEditingChangesDialog } from '@/components/common/editing/UnsavedChangesDialog';
import InteractionButton, { interactionButtonStyles, InteractionType } from '@/components/common/InteractionButton';
import SecondaryIconButton from '@/components/common/SecondaryIconButton';
import MobileNewsFeedFilter from '@/components/newsFeed/MobileNewsFeedFilter';
import NewsFeedFilter from '@/components/newsFeed/NewsFeedFilter';
import AddPostDialog from '@/components/newsPage/addPost/AddPostDialog';
import * as m from '@/src/paraglide/messages.js';
import { getProjectsOptions } from '@/utils/requests/project/requests';

import { EditingContextProvider } from '../common/editing/editing-context';

export default function NewsFeedContainer({ children }: PropsWithChildren) {
  const [addUpdateDialogOpen, setAddUpdateDialogOpen] = useState(false);
  const [projectOptions, setProjectOptions] = useState<Option[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { addEntry } = useNewsFeed();

  const handleOpenAddUpdateDialog = async () => {
    const projectOptions = await getProjectsOptions();
    setProjectOptions(projectOptions);
    setAddUpdateDialogOpen(true);
  };

  const handleAddPost = (post: Post) => {
    const entry: NewsFeedEntry = {
      type: ObjectType.POST,
      item: post,
    };
    addEntry(entry);
  };

  const handleAddUpdate = (update: ProjectUpdate) => {
    const entry: NewsFeedEntry = {
      type: ObjectType.UPDATE,
      item: update,
    };
    addEntry(entry);
  };

  return (
    <EditingContextProvider>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={3}>
          <Box display="flex" flexDirection="column">
            <Card sx={cardStyles}>
              <Typography variant="h2" sx={cardTitleStyles}>
                {m.components_newsFeed_newsFeedContainer_news()}
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 1, fontSize: 16 }}>
                {m.components_newsFeed_newsFeedContainer_allNewsText()}
              </Typography>
            </Card>

            <InteractionButton
              onClick={handleOpenAddUpdateDialog}
              interactionType={InteractionType.ADD_UPDATE}
              sx={{ ...interactionButtonStyles, ...buttonStyles }}
            />

            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Grid item>
                <SecondaryIconButton
                  label={m.components_newsFeed_newsFeedContainer_filter()}
                  icon={<FilterIcon sx={{ color: 'secondary.main' }} />}
                  onClick={() => setDrawerOpen(true)}
                />
              </Grid>
              <MobileNewsFeedFilter open={drawerOpen} setOpen={setDrawerOpen} />
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <NewsFeedFilter />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={8} lg={8}>
          {children}
        </Grid>
      </Grid>
      <AddPostDialog
        open={addUpdateDialogOpen}
        setOpen={setAddUpdateDialogOpen}
        onAddPost={handleAddPost}
        onAddUpdate={handleAddUpdate}
        projectOptions={projectOptions}
      />
      <UnsavedEditingChangesDialog />
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
