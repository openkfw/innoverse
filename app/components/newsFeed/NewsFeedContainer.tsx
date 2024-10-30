'use client';

import { PropsWithChildren, useEffect, useRef, useState } from 'react';

import FilterIcon from '@mui/icons-material/FilterAlt';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useNewsFeed } from '@/app/contexts/news-feed-context';
import { Option } from '@/common/formTypes';
import { NewsFeedEntry, ObjectType, Post, ProjectUpdate } from '@/common/types';
import { DiscardAddPostDialog } from '@/components/common/editing/DiscardAddPostDialog';
import { UnsavedEditingChangesDialog } from '@/components/common/editing/UnsavedChangesDialog';
import InteractionButton, { interactionButtonStyles, InteractionType } from '@/components/common/InteractionButton';
import SecondaryIconButton from '@/components/common/SecondaryIconButton';
import MobileNewsFeedFilter from '@/components/newsFeed/MobileNewsFeedFilter';
import NewsFeedFilter from '@/components/newsFeed/NewsFeedFilter';
import * as m from '@/src/paraglide/messages.js';
import { getProjectsOptions } from '@/utils/requests/project/requests';

import { EditingContextProvider } from '../common/editing/editing-context';
import AddPostForm from '../newsPage/addPost/form/AddPostForm';

export default function NewsFeedContainer({ children }: PropsWithChildren) {
  const [showPostForm, setShowPostForm] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [projectOptions, setProjectOptions] = useState<Option[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { addEntry } = useNewsFeed();

  const [formHeight, setFormHeight] = useState<number>(0);
  const [contentOpacity, setContentOpacity] = useState(0);
  const formRef = useRef<HTMLDivElement | null>(null);

  async function handleTogglePostForm() {
    if (!showPostForm) {
      const projectOptions = await getProjectsOptions();
      setProjectOptions(projectOptions);
      setShowPostForm(true);
    } else {
      setCancelDialogOpen(true);
    }
  }

  function handleAddPost(post: Post) {
    const entry: NewsFeedEntry = {
      type: ObjectType.POST,
      item: post,
    };
    addEntry(entry);
    setShowPostForm(false);
  }

  function handleAddUpdate(update: ProjectUpdate) {
    const entry: NewsFeedEntry = {
      type: ObjectType.UPDATE,
      item: update,
    };
    addEntry(entry);
    setShowPostForm(false);
  }

  function handleDiscardDialogConfirm() {
    setCancelDialogOpen(false);
  }

  function handleDiscardDialogClose() {
    setCancelDialogOpen(false);
    setShowPostForm(false);
  }

  function scrollToFormWithOffset(offset: number) {
    if (formRef.current) {
      const elementPosition = formRef.current.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  useEffect(() => {
    if (formRef.current) {
      if (showPostForm) {
        const targetHeight = formRef.current.scrollHeight;
        setFormHeight(targetHeight);
        setTimeout(() => setContentOpacity(1), 100);

        scrollToFormWithOffset(100);
      } else {
        setContentOpacity(0);
        setFormHeight(0);
      }
    }
  }, [showPostForm]);

  return (
    <EditingContextProvider>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={3}>
          <Card sx={cardStyles}>
            <Typography variant="h2" sx={cardTitleStyles}>
              {m.components_newsFeed_newsFeedContainer_news()}
            </Typography>
            <Typography variant="subtitle1" sx={cardSubtitleStyles}>
              {m.components_newsFeed_newsFeedContainer_allNewsText()}
            </Typography>
          </Card>
          <Box sx={stickyContainer}>
            <InteractionButton
              onClick={handleTogglePostForm}
              interactionType={InteractionType.ADD_UPDATE}
              sx={{
                ...interactionButtonStyles,
                ...buttonStyles,
                ...(showPostForm && openedFormButtonStyles),
              }}
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
        <Grid item xs={12} md={8} lg={9}>
          <Box
            ref={formRef}
            sx={{
              ...addPostFormStyles(showPostForm),
              height: `${formHeight}px`,
              transition: 'height 0.3s ease-in-out',
            }}
          >
            {showPostForm && (
              <Box
                sx={{
                  opacity: contentOpacity,
                  transition: 'opacity 0.3s ease-in-out',
                }}
              >
                <AddPostForm
                  onAddPost={handleAddPost}
                  onAddUpdate={handleAddUpdate}
                  projectOptions={projectOptions}
                  handleClose={() => setCancelDialogOpen(true)}
                />
              </Box>
            )}
          </Box>
          {children}
        </Grid>
      </Grid>

      <DiscardAddPostDialog
        open={cancelDialogOpen}
        onConfirm={handleDiscardDialogConfirm}
        onCancel={handleDiscardDialogClose}
      />

      <UnsavedEditingChangesDialog />
    </EditingContextProvider>
  );
}

// News Feed Container Styles
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

const cardSubtitleStyles = {
  mt: 1,
  fontSize: 16,
};

const stickyContainer = {
  display: 'flex',
  flexDirection: 'column',
  position: 'sticky',
  top: 50,
  overflowY: 'auto',
};

const buttonStyles = {
  my: 4,
  px: '24px',
  py: '8px',
  height: '48px',
  border: '2px solid rgba(255, 255, 255, 0.40)',
  boxShadow: 'unset',
};

const addPostFormStyles = (showPostForm: boolean) => ({
  marginBottom: showPostForm ? 2 : 0,
  borderRadius: showPostForm ? 2 : 0,
  background: showPostForm ? '#FFF' : 'transparent',
  boxShadow: showPostForm
    ? '0px 4px 26px 3px rgba(0, 0, 0, 0.12), 0px 10px 22px 1px rgba(0, 0, 0, 0.14), 0px 6px 6px -3px rgba(0, 0, 0, 0.05)'
    : 'none',
  overflow: 'hidden',
  padding: showPostForm ? 3 : 0,
});

const openedFormButtonStyles = {
  borderRadius: '50px',
  border: '2px solid #B7F9AA',
  background: 'linear-gradient(0deg, rgba(183, 249, 170, 0.2) 0%, rgba(183, 249, 170, 0.2) 100%), #FFF',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1), 0px 12px 32px rgba(0, 0, 0, 0.25)',
  backdropFilter: 'blur(24px)',
  color: '#41484C',
};
