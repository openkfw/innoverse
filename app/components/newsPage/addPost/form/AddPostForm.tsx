'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StatusCodes } from 'http-status-codes';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Option } from '@/common/formTypes';
import { Post, ProjectUpdate } from '@/common/types';
import { errorMessage, successMessage } from '@/components/common/CustomToast';
import { AutocompleteDropdownField } from '@/components/common/form/AutocompleteDropdownField';
import { CheckboxInputField } from '@/components/common/form/CheckboxInputField';
import { inputStyle } from '@/components/common/form/formStyle';
import InteractionButton, { InteractionType } from '@/components/common/InteractionButton';
import * as m from '@/src/paraglide/messages.js';

import { MultilineTextInputField } from '../../../common/form/MultilineTextInputField';
import { handleProjectUpdate } from '../../addUpdate/form/actions';

import { handleCreatePost } from './actions';
import formFieldNames from './formFields';
import { handleUpdateSchema, UpdateFormValidationSchema } from './validationSchema';

export interface FormData {
  comment: string;
  project: { id?: string; label?: string } | null;
  anonymous: boolean;
}

export interface PostFormData {
  comment: string;
  anonymous?: boolean;
}

const defaultValues = {
  comment: '',
  project: { id: '', label: m.components_newsPage_addPost_form_addPostForm_label() },
  anonymous: false,
};

const { PROJECT, COMMENT, ANONYMOUS } = formFieldNames;

interface AddPostFormProps {
  onAddPost: (post: Post) => void;
  onAddUpdate: (update: ProjectUpdate) => void;
  handleClose: () => void;
  defaultFormValues?: FormData;
  projectOptions: Option[];
}

export default function AddPostForm(props: AddPostFormProps) {
  const { onAddPost, onAddUpdate, handleClose, defaultFormValues, projectOptions } = props;

  const { handleSubmit, control, formState } = useForm<FormData>({
    defaultValues: defaultFormValues || defaultValues,
    resolver: zodResolver(handleUpdateSchema),
    mode: 'all',
  });

  const onSubmit: SubmitHandler<UpdateFormValidationSchema> = async (data) => {
    const { comment, project, anonymous } = data;

    if (project && project.id) {
      const response = await handleProjectUpdate({ comment, projectId: project.id, anonymous });
      if (response.status === StatusCodes.OK && response.data) {
        successMessage({ message: 'Neuigkeit wurde erstellt' });
        onAddUpdate(response.data);
      } else {
        errorMessage({
          message: m.components_newsPage_addPost_form_addPostForm_createError(),
        });
      }
    } else {
      const response = await handleCreatePost({ comment, anonymous });
      if (response.status === StatusCodes.OK && response.data) {
        successMessage({ message: 'Post wurde erstellt' });
        onAddPost(response.data);
      } else {
        errorMessage({
          message: m.components_newsPage_addPost_form_addPostForm_createError(),
        });
      }
    }
  };

  return (
    <Stack spacing={2} direction="column" data-testid="add-update-form">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={titleStyles}>{m.components_newsPage_addPost_addPostDialog_addPost()}</Typography>

        <Button onClick={handleClose} sx={closeButtonStyles}>
          <CloseOutlinedIcon sx={closeIconStyles} aria-label="close dialog" />
        </Button>
      </Box>

      <form>
        <MultilineTextInputField
          name={COMMENT}
          control={control}
          placeholder={m.components_newsPage_addPost_form_addPostForm_addPost()}
          sx={multilineTextStyles}
          inputPropsSx={inputPropsStyles}
        />
      </form>

      <Stack spacing={3} direction={{ sm: 'column', md: 'row' }}>
        {!defaultFormValues?.project && (
          <AutocompleteDropdownField
            name={PROJECT}
            control={control}
            label={m.components_newsPage_addPost_form_addPostForm_projectLabel()}
            options={[{ label: m.components_newsPage_addPost_form_addPostForm_label(), id: '' }, ...projectOptions]}
            readOnly={!projectOptions}
            sx={{ ...inputStyle }}
            startAdornment={
              !projectOptions && (
                <Box sx={{ pt: 1 }}>
                  <CircularProgress size={20} aria-label="loading" />
                </Box>
              )
            }
          />
        )}

        <Box sx={actionContainerStyles}>
          <CheckboxInputField
            name={ANONYMOUS}
            control={control}
            label={m.components_newsPage_addPost_form_addPostForm_anonymousPost()}
          />
          <InteractionButton
            interactionType={InteractionType.COMMENT_SEND}
            disabled={!formState.isValid}
            onClick={handleSubmit(onSubmit)}
          />
        </Box>
      </Stack>
    </Stack>
  );
}

const multilineTextStyles = {
  width: '100%',
  height: '259px',
};

const inputPropsStyles = {
  height: '100%',
  alignItems: 'baseline',
  borderRadius: 8,
};

const titleStyles = {
  color: 'primary.light',
  fontSize: '12px',
  fontFamily: 'SansDefaultReg',
  textTransform: 'uppercase',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '169%',
  letterSpacing: '1px',
};

const closeButtonStyles = {
  width: '32px',
  height: '32px',
  minWidth: 'auto',
  maxWidth: '32px',
  maxHeight: '32px',
  border: '1px solid #D8DFE3',
  borderRadius: '48px',
  padding: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '4px',
  cursor: 'pointer',
  background: 'none',
  borderColor: '#D8DFE3',
};

const closeIconStyles = {
  color: '#41484C',
  fontSize: '18px',
};

const actionContainerStyles = {
  display: { xs: 'flex', md: 'flex' },
  gap: { xs: 0, md: '24px' },
  justifyContent: { xs: 'space-between', md: 'flex-start' },
  alignItems: 'center',
  height: '60px',
};
