'use client';

import { PropsWithChildren, useState } from 'react';

import FilterIcon from '@mui/icons-material/FilterAlt';
import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';

import { SortValues, useNewsFeed } from '@/app/contexts/news-feed-context';
import { Option } from '@/common/formTypes';
import InteractionButton, { interactionButtonStyles, InteractionType } from '@/components/common/InteractionButton';
import SecondaryIconButton from '@/components/common/SecondaryIconButton';
import NewsFeedFilter from '@/components/newsFeed/NewsFeedFilter';
import AddPostDialog from '@/components/newsPage/addPost/AddPostDialog';
import MobileNewsFilter from '@/components/newsPage/newsFilter/MobileNewsFilter';
import theme from '@/styles/theme';
import { getProjectsOptions } from '@/utils/requests/project/requests';

import { EditingContextProvider } from '../common/editing/editing-context';

type NewsContainerProps = PropsWithChildren & {
  handleAddUpdate: () => void;
  sort: SortValues.ASC | SortValues.DESC;
  toggleSort: () => void;
};

function NewsFeedContainerMobile({ children, ...props }: NewsContainerProps) {
  const { handleAddUpdate, sort, toggleSort } = props;
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <InteractionButton
        onClick={handleAddUpdate}
        interactionType={InteractionType.ADD_UPDATE}
        sx={interactionButtonStyles}
      />

      <MobileNewsFilter open={drawerOpen} setOpen={setDrawerOpen} />
      <Grid item container xs={12} sx={{ mt: 3 }}>
        <Grid container justifyContent="space-between" mb={1}>
          <SecondaryIconButton
            label="Filters"
            icon={<FilterIcon sx={{ color: 'secondary.main' }} />}
            onClick={() => setDrawerOpen(true)}
          />
          <SecondaryIconButton
            label={sort === SortValues.DESC ? 'Neueste zuerst' : 'Älteste zuerst'}
            icon={<FilterListIcon sx={{ color: 'secondary.main' }} />}
            onClick={toggleSort}
          />
        </Grid>
        {children}
      </Grid>
    </>
  );
}

function NewsFeedContainerReg({ children, ...props }: NewsContainerProps) {
  const { handleAddUpdate, sort, toggleSort } = props;

  return (
    <Grid container>
      <Grid container item xs={12}>
        <InteractionButton
          onClick={handleAddUpdate}
          interactionType={InteractionType.ADD_UPDATE}
          sx={{ ...interactionButtonStyles, ...buttonStyles }}
        />
      </Grid>
      <Grid item xs={4} sm={4} md={4} lg={3}>
        <NewsFeedFilter />
      </Grid>
      <Grid item xs={8} sm={8} md={8} lg={9} mt={-1}>
        <Box mb={1} display="flex" justifyContent="flex-end">
          <SecondaryIconButton
            label={sort === SortValues.DESC ? 'Neueste zuerst' : 'Älteste zuerst'}
            icon={<FilterListIcon sx={{ color: 'secondary.main' }} />}
            onClick={toggleSort}
          />
        </Box>
        {children}
      </Grid>
    </Grid>
  );
}

export default function NewsFeedContainer({ children }: PropsWithChildren) {
  const [addUpdateDialogOpen, setAddUpdateDialogOpen] = useState(false);
  const [projectOptions, setProjectOptions] = useState<Option[]>([]);
  const { refetchFeed } = useNewsFeed();

  const { sort, toggleSort } = useNewsFeed();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleAddUpdate = async () => {
    const projectOptions = await getProjectsOptions();
    setProjectOptions(projectOptions);
    setAddUpdateDialogOpen(true);
  };

  return (
    <EditingContextProvider>
      <Grid container item sx={{ mt: 4 }} xs={12}>
        {isSmallScreen ? (
          <NewsFeedContainerMobile handleAddUpdate={handleAddUpdate} sort={sort} toggleSort={toggleSort}>
            {children}
          </NewsFeedContainerMobile>
        ) : (
          <NewsFeedContainerReg handleAddUpdate={handleAddUpdate} sort={sort} toggleSort={toggleSort}>
            {children}
          </NewsFeedContainerReg>
        )}
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

const buttonStyles = {
  px: '24px',
  py: '8px',
  height: '48px',
  border: '2px solid rgba(255, 255, 255, 0.40)',
};
