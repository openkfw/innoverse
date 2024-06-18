import { Option } from '@/common/formTypes';
import { Filters } from '@/common/types';
import CustomDialog from '@/components/common/CustomDialog';

import AddPostForm, { FormData } from './form/AddPostForm';

interface AddPostDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  refetchUpdates: (options?: { filters?: Filters; fullRefetch?: boolean }) => void;
  defaultFormValues?: FormData;
  projectOptions: Option[];
}

export default function AddPostDialog(props: AddPostDialogProps) {
  const { open, setOpen, refetchUpdates, defaultFormValues, projectOptions } = props;

  function handleClose() {
    setOpen(false);
  }

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title="Beitrag hinzufügen"
      sx={dialogStyles}
      titleSx={dialogTitleStyles}
    >
      <AddPostForm
        handleClose={handleClose}
        defaultFormValues={defaultFormValues}
        projectOptions={projectOptions}
        refetchUpdates={refetchUpdates}
      />
    </CustomDialog>
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
  fontFamily: '***FONT_REMOVED***',
  textTransform: 'uppercase',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '169%',
  letterSpacing: '1px',
};
