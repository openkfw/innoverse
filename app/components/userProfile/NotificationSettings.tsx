'use client';

import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StatusCodes } from 'http-status-codes';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import * as m from '@/src/paraglide/messages.js';

import { errorMessage, successMessage } from '../common/CustomToast';
import { CheckboxInputField } from '../common/form/CheckboxInputField';
import { FormSaveButton } from '../common/form/SaveButton';

import { getNotificationSettings, updateNotificationSettings } from './actions';
import formFieldNames from './formFields';
import { handleUpdateNotificationSettings, NotificationSettingsFormValidationSchema } from './validationSchema';

const { WEEKLY_EMAIL } = formFieldNames;

export default function NotificationSettings() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [state, setState] = useState<{ weeklyEmail: boolean } | undefined>(undefined);

  const {
    reset,
    handleSubmit,
    control,
    formState: { isDirty, isValid },
  } = useForm<NotificationSettingsFormValidationSchema>({
    mode: 'all',
    resolver: zodResolver(handleUpdateNotificationSettings),
    defaultValues: {
      weeklyEmail: true,
    },
  });

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      const result = await getNotificationSettings();

      if (result.status === StatusCodes.OK) {
        setState(result.data);
      } else {
        errorMessage({ message: m.components_profilePage_getNotificationSettings_error() });
      }
      setIsLoading(false);
    };

    fetchNotificationSettings();
  }, []);

  useEffect(() => {
    if (state) {
      reset(state);
    }
  }, [state, reset]);

  // on mount, if emailPreferencesChanged=success in query params, show success message
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailPreferencesChanged = urlParams.get('emailPreferencesChanged');
    if (emailPreferencesChanged === 'success') {
      successMessage({ message: m.components_profilePage_emailPreferencesChanged_success() });
    } else if (emailPreferencesChanged === 'error') {
      errorMessage({ message: m.components_profilePage_emailPreferencesChanged_error() });
    }
  }, []);

  const onSubmit: SubmitHandler<NotificationSettingsFormValidationSchema> = async (submitData) => {
    const result = await updateNotificationSettings(submitData);

    if (result.status === StatusCodes.OK) {
      await setState(result.data);
      successMessage({ message: m.components_profilePage_form_updateUserForm_success() });
      return;
    } else {
      errorMessage({ message: m.components_profilePage_form_updateUserForm_error() });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card sx={cardStyles}>
          <Typography variant="h2" sx={cardTitleStyles}>
            {m.app_notification_settings()}
          </Typography>
          {isLoading && !state ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress aria-label="loading" />
            </Box>
          ) : (
            <form>
              <Stack spacing={2} direction="column">
                <CheckboxInputField
                  control={control}
                  name={WEEKLY_EMAIL}
                  label={m.components_profilePage_form_weeklyEmails()}
                />
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
