'use client';

import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs, { Dayjs } from 'dayjs';
import { StatusCodes } from 'http-status-codes';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useUser } from '@/app/contexts/user-context';
import { Option } from '@/common/formTypes';
import { UserSession } from '@/common/types';
import { errorMessage, successMessage } from '@/components/common/CustomToast';
import { DropdownField } from '@/components/common/form/DropdownField';
import { TextInputField } from '@/components/common/form/TextInputField';
import theme from '@/styles/theme';

import { DateInputField } from '../../../common/form/DateInputField';
import { MultilineTextInputField } from '../../../common/form/MultilineTextInputField';

import { getProjectsOptions, handleProjectUpdate } from './actions';
import formFieldNames from './formFields';
import { formValidationSchema, UpdateFormValidationSchema } from './validationSchema';

export interface UpdateFormData {
  comment: string;
  date: Dayjs;
  author: string;
  projectId: string;
  authorId?: string;
}

export interface AddUpdateFormData extends Omit<UpdateFormData, 'date'> {
  date: string;
}

const defaultValues = {
  comment: '',
  date: dayjs(new Date()),
  author: '',
  projectId: '',
};

const { PROJECT_ID, AUTHOR, DATE, COMMENT } = formFieldNames;

interface AddUpdateFormProps {
  setUpdateAdded: (added: boolean) => void;
  handleClose: () => void;
  defaultFormValues?: UpdateFormData;
}

export default function AddUpdateForm({ setUpdateAdded, handleClose, defaultFormValues }: AddUpdateFormProps) {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isDirty, isValid },
  } = useForm<UpdateFormData>({
    defaultValues: defaultFormValues || defaultValues,
    resolver: zodResolver(formValidationSchema),
    mode: 'all',
  });

  const [projectOptions, setProjectOptions] = useState<Option[]>([]);
  const { user } = useUser();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const openToast = (success: boolean = true) => {
    if (success) {
      successMessage({ message: 'Update was successfully added' });
      return;
    } else {
      errorMessage({ message: 'There was an error when adding an update' });
    }
  };

  const onSubmit: SubmitHandler<UpdateFormValidationSchema> = async (data) => {
    const { comment, projectId, date } = data;
    const formData = {
      comment,
      projectId,
      date: date.format('YYYY-MM-DD'),
    };

    const res = await handleProjectUpdate(formData);
    if (res.status === StatusCodes.OK) {
      setUpdateAdded(true);
      openToast();
      handleClose();
    } else {
      openToast(false);
    }
  };

  useEffect(() => {
    const setValues = async () => {
      const options = await getProjectsOptions();
      setProjectOptions(options);
      setValue('author', (user as UserSession).name);
      setUpdateAdded(false);
    };

    setValues();
  }, []);

  return (
    <>
      <Stack spacing={2} sx={formStyles} direction="column">
        <Stack spacing={2} direction={isSmallScreen ? 'column' : 'row'}>
          <TextInputField name={AUTHOR} control={control} label="Author" readOnly sx={inputStyle} />
          {projectOptions.length > 0 && (
            <DropdownField
              name={PROJECT_ID}
              control={control}
              label="Projekt"
              options={projectOptions}
              sx={inputStyle}
            />
          )}
        </Stack>
        <form>
          <Stack spacing={2} direction={isSmallScreen ? 'column' : 'row'}>
            <DateInputField name={DATE} control={control} label="Datum" disableFuture sx={inputStyle} />
            <MultilineTextInputField
              name={COMMENT}
              control={control}
              label="Kommentar"
              placeholder="Geben Sie hier Ihren Kommentar ein"
              sx={inputStyle}
            />
          </Stack>
        </form>

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
    </>
  );
}

const inputStyle = {
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: '50%',
  },
};

const formStyles = {
  display: 'flex',
  flexDirection: 'column',
  borderTop: '1px solid rgba(0, 90, 140, 0.10)',
  paddingTop: 3,
  width: 'min(500px, 70vw)',
};
