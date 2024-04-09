import { Option } from '@/common/formTypes';
import CustomDialog from '@/components/common/CustomDialog';

import AddUpdateForm, { UpdateFormData } from './form/AddUpdateForm';

interface AddUpdateDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  refetchUpdates: () => void;
  defaultFormValues?: UpdateFormData;
  projectOptions: Option[];
}

export default function AddUpdateDialog(props: AddUpdateDialogProps) {
  const { open, setOpen, refetchUpdates, defaultFormValues, projectOptions } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <CustomDialog open={open} handleClose={handleClose} title="Neuigkeit hinzufügen">
      <AddUpdateForm
        refetchUpdates={refetchUpdates}
        handleClose={handleClose}
        defaultFormValues={defaultFormValues}
        projectOptions={projectOptions}
      />
    </CustomDialog>
  );
}
