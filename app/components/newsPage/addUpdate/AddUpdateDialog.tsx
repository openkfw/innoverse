import CustomDialog from '@/components/common/CustomDialog';

import AddUpdateForm, { UpdateFormData } from './form/AddUpdateForm';

interface AddUpdateDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setUpdateAdded: (added: boolean) => void;
  defaultFormValues?: UpdateFormData;
}

export default function AddUpdateDialog(props: AddUpdateDialogProps) {
  const { open, setOpen, setUpdateAdded, defaultFormValues } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <CustomDialog open={open} handleClose={handleClose} title="Neuigkeit hinzufügen">
      <AddUpdateForm setUpdateAdded={setUpdateAdded} handleClose={handleClose} defaultFormValues={defaultFormValues} />
    </CustomDialog>
  );
}
