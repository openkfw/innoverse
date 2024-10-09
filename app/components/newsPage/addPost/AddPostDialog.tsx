import { useState } from 'react';

import { Option } from '@/common/formTypes';
import { Post, ProjectUpdate } from '@/common/types';
import CustomDialog from '@/components/common/CustomDialog';
import * as m from '@/src/paraglide/messages.js';

import { DiscardAddPostDialog } from '../../common/editing/DiscardAddPostDialog';

import AddPostForm, { FormData } from './form/AddPostForm';

interface AddPostDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddPost: (post: Post) => void;
  onAddUpdate: (update: ProjectUpdate) => void;
  defaultFormValues?: FormData;
  projectOptions: Option[];
}

export default function AddPostDialog(props: AddPostDialogProps) {
  const { open, setOpen, onAddPost, onAddUpdate, defaultFormValues, projectOptions } = props;

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  function handleClose() {
    setCancelDialogOpen(true);
  }

  function handleCancelDialogClose() {
    setCancelDialogOpen(false);
    setOpen(false);
  }

  function handleConfirmDialogClose() {
    setCancelDialogOpen(false);
  }

  return (
    <>
      <CustomDialog
        open={open}
        handleClose={handleClose}
        title={m.components_newsPage_addPost_addPostDialog_addPost()}
        sx={dialogStyles}
        titleSx={dialogTitleStyles}
      >
        <AddPostForm
          handleClose={handleCancelDialogClose}
          defaultFormValues={defaultFormValues}
          projectOptions={projectOptions}
          onAddPost={onAddPost}
          onAddUpdate={onAddUpdate}
        />
      </CustomDialog>

      <DiscardAddPostDialog
        open={cancelDialogOpen}
        onConfirm={handleConfirmDialogClose}
        onCancel={handleCancelDialogClose}
      />
    </>
  );
}

// Add Post Dialog
const dialogStyles = {
  width: { xs: '100%', md: '712px', lg: '712px' },
  maxWidth: { xs: '500px', md: '712px', lg: '712px' },
};

const dialogTitleStyles = {
  color: 'primary.light',
  fontSize: '12px',
  fontFamily: 'SansDefaultReg',
  textTransform: 'uppercase',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '169%',
  letterSpacing: '1px',
};
