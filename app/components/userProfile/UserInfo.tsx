'use client';

import * as m from '@/src/paraglide/messages.js';

import { useUser } from '@/app/contexts/user-context';
import { Stack } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FormSaveButton } from '../common/form/SaveButton';
import { TextInputField } from '../common/form/TextInputField';

export default function UserInfo() {
  const { user } = useUser();
  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid },
  } = useForm({
    mode: 'all',
  });

  const onSubmit: SubmitHandler<any> = async (data) => {};

  return (
    <Stack spacing={2} direction="column" data-testid="user-profile-form">
      <form></form>
      <FormSaveButton onSave={handleSubmit(onSubmit)} disabled={!isDirty || !isValid} />
    </Stack>
  );
}
