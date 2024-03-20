'use client';

import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs, { Dayjs } from 'dayjs';
import { StatusCodes } from 'http-status-codes';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

import { Option } from '@/common/formTypes';
import { errorMessage, successMessage } from '@/components/common/CustomToast';
import { DropdownField } from '@/components/common/form/DropdownField';

import { DateInputField } from '../../../common/form/DateInputField';
import { MultilineTextInputField } from '../../../common/form/MultilineTextInputField';

import { getProjectsOptions, handleProjectUpdate } from './actions';
import formFieldNames from './formFields';
import { formValidationSchema, UpdateFormValidationSchema } from './validationSchema';

export interface UpdateFormData {
  comment: string;
  date: Dayjs;
  projectId: string;
  authorId?: string;
}

export interface AddUpdateFormData extends Omit<UpdateFormData, 'date'> {
  date: string;
}

const defaultValues = {
  comment: '',
  date: dayjs(new Date()),
  projectId: '',
};

const { PROJECT_ID, DATE, COMMENT } = formFieldNames;

interface AddUpdateFormProps {
  setUpdateAdded: (added: boolean) => void;
  handleClose: () => void;
  defaultFormValues?: UpdateFormData;
}

export default function AddUpdateForm({ setUpdateAdded, handleClose, defaultFormValues }: AddUpdateFormProps) {
  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid },
  } = useForm<UpdateFormData>({
    defaultValues: defaultFormValues || defaultValues,
    resolver: zodResolver(formValidationSchema),
    mode: 'all',
  });

  const [projectOptions, setProjectOptions] = useState<Option[]>();

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

    const response = await handleProjectUpdate(formData);
    if (response.status === StatusCodes.OK) {
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
      setUpdateAdded(false);
    };

    setValues();
  }, [setUpdateAdded]);

  return (
    <>
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
          <DateInputField
            name={DATE}
            control={control}
            label="Datum"
            disableFuture
            sx={{ ...inputStyle, maxWidth: '180px', mb: 2 }}
          />
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
    </>
  );
}

const inputStyle = {
  width: '100%',
  '& .MuiInputLabel-root': {
    color: 'primary.main',
  },
};

const formStyles = {
  display: 'flex',
  flexDirection: 'column',
  borderTop: '1px solid rgba(0, 90, 140, 0.10)',
  paddingTop: 3,
  width: 'min(500px, 70vw)',
};
