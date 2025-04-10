'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StatusCodes } from 'http-status-codes';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

import { Option } from '@/common/formTypes';
import { Filters } from '@/common/types';
import { errorMessage, successMessage } from '@/components/common/CustomToast';
import { AutocompleteDropdownField } from '@/components/common/form/AutocompleteDropdownField';
import { CheckboxInputField } from '@/components/common/form/CheckboxInputField';
import { FormSaveButton } from '@/components/common/form/SaveButton';
import * as m from '@/src/paraglide/messages.js';

import { MultilineTextInputField } from '../../../common/form/MultilineTextInputField';

import { handleProjectUpdate } from './actions';
import formFieldNames from './formFields';
import { formValidationSchema, UpdateFormValidationSchema } from './validationSchema';

export interface AddUpdateData {
  comment: string;
  projectId: string;
  authorId?: string;
  anonymous?: boolean;
}
export interface UpdateFormData {
  comment: string;
  project: { id: string; label: string } | null;
  authorId?: string;
  anonymous?: boolean;
}

const defaultValues = {
  comment: '',
  project: null,
  anonymous: false,
};

const { PROJECT, COMMENT, ANONYMOUS } = formFieldNames;

interface AddUpdateFormProps {
  refetchUpdates: (options?: { filters?: Filters; fullRefetch?: boolean }) => void;
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
    const { comment, project, anonymous } = data;
    if (project) {
      const formData = {
        comment,
        anonymous,
        projectId: project?.id,
      };

      const response = await handleProjectUpdate(formData);
      if (response.status === StatusCodes.OK) {
        refetchUpdates({ fullRefetch: true });
        successMessage({ message: m.components_newsPage_addUpdate_form_addUpdateForm_postCreated() });
        handleClose();
      } else {
        errorMessage({
          message: m.components_newsPage_addUpdate_form_addUpdateForm_error(),
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
          label={m.components_newsPage_addUpdate_form_addUpdateForm_updateLabel()}
          placeholder={m.components_newsPage_addUpdate_form_addUpdateForm_placeholder()}
          sx={{ width: '100%' }}
        />
      </form>
      <Stack spacing={2} direction={{ sm: 'column', md: 'row' }}>
        {!defaultFormValues?.project && (
          <AutocompleteDropdownField
            name={PROJECT}
            control={control}
            label="Initiative"
            options={projectOptions}
            readOnly={!projectOptions}
            startAdornment={
              !projectOptions && (
                <Box sx={{ pt: 1 }}>
                  <CircularProgress size={20} aria-label="loading" />
                </Box>
              )
            }
          />
        )}
      </Stack>
      <CheckboxInputField
        name={ANONYMOUS}
        control={control}
        label={m.components_newsPage_addUpdate_form_addUpdateForm_anonymousPost()}
        sx={{ width: '35%' }}
      />

      <FormSaveButton onSave={handleSubmit(onSubmit)} disabled={!isDirty || !isValid} />
    </Stack>
  );
}

const formStyles = {
  borderTop: '1px solid rgba(0, 90, 140, 0.10)',
  paddingTop: 3,
};
