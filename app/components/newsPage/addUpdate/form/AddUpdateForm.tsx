'use client';

import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
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
import theme from '@/styles/theme';

import { getProjectsOptions, handleProjectUpdate } from './actions';
import { DateInputField } from './DateInputField';
import { DropdownField } from './DropdownField';
import formFieldNames from './formFields';
import { MultilineTextInputField } from './MultilineTextInputField';
import { TextInputField } from './TextInputField';
import { formValidationSchema, UpdateFormValidationSchema } from './validationSchema';

export interface UpdateFormData {
  comment: string;
  date: Dayjs;
  author: string;
  projectId: string;
  authorId?: string;
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
      toast.success('Update was successfully added');
      return;
    }
    toast.error('There was an error when adding an update');
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
          <TextInputField name={AUTHOR} control={control} label="Author" readOnly />
          <DropdownField name={PROJECT_ID} control={control} label="Projekt" options={projectOptions} />
        </Stack>
        <Stack spacing={2} direction={isSmallScreen ? 'column' : 'row'}>
          <DateInputField name={DATE} control={control} label="Datum" disableFuture />
          <MultilineTextInputField
            name={COMMENT}
            control={control}
            label="Kommentar"
            placeholder="Geben Sie hier Ihren Kommentar ein"
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
    </>
  );
}

export const inputStyle = {
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: '50%',
  },
  '& .MuiFormLabel-root': {
    color: 'primary.main',
    fontFamily: '***FONT_REMOVED***',
    fontSize: '14px',
    '&.Mui-focused': {
      color: 'primary.main',
    },
  },
};

const formStyles = {
  display: 'flex',
  flexDirection: 'column',
  borderTop: '1px solid rgba(0, 90, 140, 0.10)',
  paddingTop: 3,
  width: 'min(500px, 70vw)',
};
