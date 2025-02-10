'use client';

import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StatusCodes } from 'http-status-codes';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useUser } from '@/app/contexts/user-context';
import { UserSession } from '@/common/types';
import * as m from '@/src/paraglide/messages.js';

import { errorMessage, successMessage } from '../common/CustomToast';
import { ImageDropzoneField } from '../common/form/ImageDropzoneField';
import { FormSaveButton } from '../common/form/SaveButton';
import { TextInputField } from '../common/form/TextInputField';

import { updateUserProfile } from './actions';
import formFieldNames from './formFields';
import { handleUpdateUserSession, UserSessionFormValidationSchema } from './validationSchema';

const { NAME, EMAIL, ROLE, DEPARTMENT, IMAGE } = formFieldNames;

export default function UserInfo() {
  const { user, updateUser, isLoading } = useUser();

  const {
    reset,
    handleSubmit,
    control,
    setValue,
    formState: { isDirty, isValid, errors },
  } = useForm<UserSessionFormValidationSchema>({
    mode: 'all',
    resolver: zodResolver(handleUpdateUserSession),
    defaultValues: {
      name: '',
      email: '',
      role: '',
      department: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const onSubmit: SubmitHandler<UserSessionFormValidationSchema> = async (submitData) => {
    const { image, ...rest } = submitData;

    let userImage = image;
    if (userImage && userImage instanceof File) {
      const formData = new FormData();
      formData.append('image', userImage);
      userImage = formData;
    }

    const { data: updatedUser, status } = await updateUserProfile({
      ...rest,
      image: userImage,
    });

    if (status === StatusCodes.OK) {
      await updateUser(updatedUser as UserSession);
      successMessage({ message: m.components_profilePage_form_updateUserForm_success() });
      return;
    } else {
      errorMessage({ message: m.components_profilePage_form_updateUserForm_error() });
    }
  };

  console.log('isDirty', isDirty, isValid, errors);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card sx={cardStyles}>
          <Typography variant="h2" sx={cardTitleStyles}>
            {m.app_user_profile()}
          </Typography>
          {isLoading && !user ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress aria-label="loading" />
            </Box>
          ) : (
            <form>
              <Stack spacing={2} direction="column">
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextInputField name={NAME} label="Name" control={control} secondary disabled />
                  <TextInputField name={EMAIL} label="Email" control={control} secondary disabled />
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextInputField name={ROLE} label="Role" control={control} secondary />
                  <TextInputField name={DEPARTMENT} label="Department" control={control} secondary />
                </Stack>
                <ImageDropzoneField name={IMAGE} control={control} setValue={setValue} />
                <FormSaveButton onSave={handleSubmit(onSubmit)} disabled={!isDirty || !isValid} />
              </Stack>
            </form>
          )}
        </Card>
      </Grid>
    </Grid>
  );
}

const cardStyles = {
  px: 3,
  py: 4,
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.20)',
  backgroundColor: 'rgba(255, 255, 255, 0.10)',
  boxShadow: '0px 12px 40px 0px rgba(0, 0, 0, 0.25)',
  backdropFilter: 'blur(20px)',
};

const cardTitleStyles = {
  fontSize: 36,
  mb: 3,
};
