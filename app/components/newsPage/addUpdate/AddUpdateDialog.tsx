import { Option } from '@/common/formTypes';
import { Filters } from '@/common/types';
import CustomDialog from '@/components/common/CustomDialog';
import * as m from '@/src/paraglide/messages.js';

import AddUpdateForm, { UpdateFormData } from './form/AddUpdateForm';

interface AddUpdateDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  refetchUpdates: (options?: { filters?: Filters; fullRefetch?: boolean }) => void;
  defaultFormValues?: UpdateFormData;
  projectOptions: Option[];
}

export default function AddUpdateDialog(props: AddUpdateDialogProps) {
  const { open, setOpen, refetchUpdates, defaultFormValues, projectOptions } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={m.components_newsPage_addUpdate_addUpdateDialog_addUpdate()}
      sx={{ width: { xs: '100%' }, maxWidth: { xs: '500px' } }}
    >
      <AddUpdateForm
        handleClose={handleClose}
        defaultFormValues={defaultFormValues}
        projectOptions={projectOptions}
        refetchUpdates={refetchUpdates}
      />
    </CustomDialog>
  );
}
