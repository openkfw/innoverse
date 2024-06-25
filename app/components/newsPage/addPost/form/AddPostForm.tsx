'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StatusCodes } from 'http-status-codes';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

import { Option } from '@/common/formTypes';
import { Post, ProjectUpdate } from '@/common/types';
import { errorMessage, successMessage } from '@/components/common/CustomToast';
import { AutocompleteDropdownField } from '@/components/common/form/AutocompleteDropdownField';
import { inputStyle } from '@/components/common/form/formStyle';
import InteractionButton, { InteractionType } from '@/components/common/InteractionButton';

import { MultilineTextInputField } from '../../../common/form/MultilineTextInputField';
import { handleProjectUpdate } from '../../addUpdate/form/actions';

import { handlePost } from './actions';
import formFieldNames from './formFields';
import { handleUpdateSchema, UpdateFormValidationSchema } from './validationSchema';

export interface FormData {
  content: string;
  project: { id?: string; label?: string } | null;
}

export interface PostFormData {
  content: string;
}

const defaultValues = {
  content: '',
  project: { id: '', label: '-optional-' },
};

const { PROJECT, CONTENT } = formFieldNames;

interface AddUpdateFormProps {
  onAddPost: (post: Post) => void;
  onAddUpdate: (update: ProjectUpdate) => void;
  handleClose: () => void;
  defaultFormValues?: FormData;
  projectOptions: Option[];
}

export default function AddPostForm(props: AddUpdateFormProps) {
  const { onAddPost, onAddUpdate, handleClose, defaultFormValues, projectOptions } = props;

  const { handleSubmit, control, formState } = useForm<FormData>({
    defaultValues: defaultFormValues || defaultValues,
    resolver: zodResolver(handleUpdateSchema),
    mode: 'all',
  });

  const onSubmit: SubmitHandler<UpdateFormValidationSchema> = async (data) => {
    const { content, project } = data;

    if (project && project.id) {
      const response = await handleProjectUpdate({ comment: content, projectId: project.id });
      if (response.status === StatusCodes.OK && response.data) {
        successMessage({ message: 'Neuigkeit wurde erstellt' });
        onAddUpdate(response.data);
        handleClose();
      } else {
        errorMessage({
          message: 'Es ist ein Fehler beim Erstellen der Neuigkeit aufgetreten. Bitte versuchen sie es erneut',
        });
      }
    } else {
      const response = await handlePost({ content });
      if (response.status === StatusCodes.OK && response.data) {
        const post: Post = { ...response.data, responseCount: 0 };
        successMessage({ message: 'Post wurde erstellt' });
        onAddPost(post);
        handleClose();
      } else {
        errorMessage({
          message: 'Es ist ein Fehler beim Erstellen der Post aufgetreten. Bitte versuchen sie es erneut',
        });
      }
    }
  };

  return (
    <Stack spacing={2} sx={formStyles} direction="column" data-testid="add-update-form">
      <form>
        <MultilineTextInputField
          name={CONTENT}
          control={control}
          placeholder="Hier kannst du deinen Beitrag hinzufügen …"
          sx={multilineTextStyles}
          inputPropsSx={inputPropsStyles}
        />
      </form>

      <Stack spacing={2} direction={{ sm: 'column', md: 'row' }}>
        {!defaultFormValues?.project && (
          <AutocompleteDropdownField
            name={PROJECT}
            control={control}
            label="Projekt"
            options={[{ label: '-optional-', id: '' }, ...projectOptions]}
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
        )}

        <InteractionButton
          interactionType={InteractionType.COMMENT_SEND}
          disabled={!formState.isValid}
          onClick={handleSubmit(onSubmit)}
        />
      </Stack>
    </Stack>
  );
}

const formStyles = {
  borderTop: '1px solid rgba(0, 90, 140, 0.10)',
  paddingTop: 3,
};

const multilineTextStyles = {
  width: '100%',
  height: '259px',
};

const inputPropsStyles = {
  height: '100%',
  alignItems: 'baseline',
};
