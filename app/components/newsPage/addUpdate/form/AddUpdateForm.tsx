'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StatusCodes } from 'http-status-codes';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

import { Option } from '@/common/formTypes';
import { errorMessage, successMessage } from '@/components/common/CustomToast';
import { DropdownField } from '@/components/common/form/DropdownField';

import { MultilineTextInputField } from '../../../common/form/MultilineTextInputField';

import { handleProjectUpdate } from './actions';
import formFieldNames from './formFields';
import { formValidationSchema, UpdateFormValidationSchema } from './validationSchema';

export interface UpdateFormData {
  comment: string;
  projectId: string;
  authorId?: string;
}

const defaultValues = {
  comment: '',
  projectId: '',
};

const { PROJECT_ID, COMMENT } = formFieldNames;

interface AddUpdateFormProps {
  refetchUpdates: () => void;
  handleClose: () => void;
  defaultFormValues?: UpdateFormData;
  projectOptions: Option[];
}

export default function AddUpdateForm({
  refetchUpdates,
  handleClose,
  defaultFormValues,
  projectOptions,
}: AddUpdateFormProps) {
  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid },
  } = useForm<UpdateFormData>({
    defaultValues: defaultFormValues || defaultValues,
    resolver: zodResolver(formValidationSchema),
    mode: 'all',
  });

  const onSubmit: SubmitHandler<UpdateFormValidationSchema> = async (data) => {
    const { comment, projectId } = data;
    const formData = {
      comment,
      projectId,
    };

    const response = await handleProjectUpdate(formData);
    if (response.status === StatusCodes.OK) {
      refetchUpdates();
      successMessage({ message: 'Update was successfully created' });
      handleClose();
    } else {
      errorMessage({ message: 'There was an error when adding an update' });
    }
  };

  return (
    <Stack spacing={2} sx={formStyles} direction="column">
      <form>
        <MultilineTextInputField
          name={COMMENT}
          control={control}
          label="Update"
          placeholder="Geben Sie hier das Update ein"
          sx={{ width: '100%' }}
        />
      </form>
      <Stack spacing={2} direction={{ sm: 'column', md: 'row' }}>
        <DropdownField
          name={PROJECT_ID}
          control={control}
          label="Initiative"
          options={projectOptions}
          readOnly={!!!projectOptions}
          startAdornment={
            !!!projectOptions && (
              <Box sx={{ pt: 1 }}>
                <CircularProgress size={20} />
              </Box>
            )
          }
          sx={inputStyle}
        />
      </Stack>

      <Box display="flex" justifyContent="flex-end">
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          size="small"
          disabled={!isDirty || !isValid}
          sx={{ width: '30%', backgroundColor: 'secondary.main' }}
        >
          Speichern
        </Button>
      </Box>
    </Stack>
  );
}

const inputStyle = {
  width: '100%',
  '& .MuiInputLabel-root': {
    color: 'primary.main',
  },
};

const formStyles = {
  borderTop: '1px solid rgba(0, 90, 140, 0.10)',
  paddingTop: 3,
};
