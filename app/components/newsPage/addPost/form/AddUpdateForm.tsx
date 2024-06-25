'use client';

export interface AddPostData {
  content: string;
  authorId?: string;
}

export interface UpdatePostData {
  content: string;
  authorId?: string;
}

/*
const defaultValues = {
  content: '',
};

const { PROJECT, COMMENT } = formFieldNames;

interface AddPostFormProps {
  refetchUpdates: (options?: { filters?: Filters; fullRefetch?: boolean }) => void;
  handleClose: () => void;
  defaultFormValues?: UpdatePostData;
  projectOptions: Option[];
}

export default function AddUpdateForm({
  refetchUpdates,
  handleClose,
  defaultFormValues,
  projectOptions,
}: AddPostFormProps) {
  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid },
  } = useForm<UpdatePostData>({
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

      const response = await handlePost(formData);
      if (response.status === StatusCodes.OK) {
        refetchUpdates({ fullRefetch: true });
        successMessage({ message: m.components_newsPage_addPost_form_addUpdateForm_success() });
        handleClose();
      } else {
        errorMessage({
          message: m.components_newsPage_addPost_form_addUpdateForm_error(),
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
          label={m.components_newsPage_addPost_form_addUpdateForm_updateLabel()}
          placeholder={m.components_newsPage_addPost_form_addUpdateForm_placeholder()}
          sx={{ width: '100%' }}
        />
      </form>
      

      <DialogSaveButton disabled={}>
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

*/
