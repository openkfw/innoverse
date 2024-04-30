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
import { AutocompleteDropdownField } from '@/components/common/form/AutocompleteDropdownField';

import { MultilineTextInputField } from '../../../common/form/MultilineTextInputField';

import { handleProjectUpdate } from './actions';
import formFieldNames from './formFields';
import { formValidationSchema, UpdateFormValidationSchema } from './validationSchema';

export interface AddUpdateData {
  comment: string;
  projectId: string;
  authorId?: string;
}
export interface UpdateFormData {
  comment: string;
  project: { id: string; label: string } | null;
  authorId?: string;
}

const defaultValues = {
  comment: '',
  project: null,
};

const { PROJECT, COMMENT } = formFieldNames;

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
    const { comment, project } = data;
    if (project) {
      const formData = {
        comment,
        projectId: project?.id,
      };

      const response = await handleProjectUpdate(formData);
      if (response.status === StatusCodes.OK) {
        refetchUpdates();
        successMessage({ message: 'Neuigkeit wurde erstellt' });
        handleClose();
      } else {
        errorMessage({
          message: 'Es ist ein Fehler beim Erstellen der Neuigkeit aufgetreten. Bitte versuchen sie es erneut',
        });
      }
    }
  };

  return (
    <Stack spacing={2} sx={formStyles} direction="column" data-testid="add-update-form">
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
        <AutocompleteDropdownField
          name={PROJECT}
          control={control}
          label="Initiative"
          options={projectOptions}
          readOnly={!projectOptions}
          startAdornment={
            !projectOptions && (
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
