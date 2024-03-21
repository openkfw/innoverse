'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import CloseIcon from '@mui/icons-material/Close';
import { Divider } from '@mui/material';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';

import { useUser } from '@/app/contexts/user-context';
import CustomButton from '@/components/common/CustomButton';
import { errorMessage } from '@/components/common/CustomToast';

import AvatarIcon from '../../common/AvatarIcon';
import { MultilineTextInputField } from '../../common/form/MultilineTextInputField';
import InteractionButton, { InteractionType } from '../../common/InteractionButton';

import formFieldNames from './formFields';
import { CommentFormValidationSchema, formValidationSchema } from './validationSchema';

interface WriteCommentCardProps {
  projectName: string;
  onSubmit: (comment: string) => Promise<void>;
  onDiscard?: ({ isDirty }: { isDirty: boolean }) => void;
  submitButton?: React.ReactNode;
  defaultValues?: {
    comment: string;
  };
  sx?: SxProps;
}

interface CommentFormData {
  comment: string;
}

const { COMMENT } = formFieldNames;

const WriteCommentCard = ({
  projectName,
  onSubmit,
  onDiscard,
  submitButton,
  defaultValues,
  sx,
}: WriteCommentCardProps) => {
  const { user } = useUser();
  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isValid },
  } = useForm<CommentFormData>({
    defaultValues: {
      [formFieldNames.COMMENT]: defaultValues?.comment ?? '',
    },
    resolver: zodResolver(formValidationSchema),
  });

  const placeholder =
    'Teil deine Ratschläge und Gedanken zu diesem Thema, damit deine Kollegen von deiner Expertise profitieren können.';

  const submit: SubmitHandler<CommentFormValidationSchema> = async (data) => {
    try {
      await onSubmit(data.comment);
      reset();
    } catch (error) {
      console.error('Failed to submit comment:', error);
      errorMessage({ message: 'Failed to submit your comment. Please try again.' });
    }
  };

  const discard = () => {
    onDiscard && onDiscard({ isDirty });
  };

  return (
    <>
      {user && (
        <Stack direction="row" spacing={1} sx={sx}>
          <AvatarIcon user={user} size={32} />
          <form style={{ width: '100%' }}>
            <MultilineTextInputField
              name={COMMENT}
              control={control}
              placeholder={placeholder}
              rows={4}
              sx={textFieldStyles}
              endAdornment={<EndAdornment />}
            />
          </form>
        </Stack>
      )}
    </>
  );

  function EndAdornment() {
    return (
      <>
        {onDiscard && <Divider sx={{ pt: 1, mb: 2 }} />}
        <Stack direction={'row'} flexWrap={'wrap'} spacing={1} rowGap={1} sx={buttonWrapperStyles}>
          {onDiscard && (
            <CustomButton
              themeVariant="secondary"
              startIcon={<CloseIcon sx={{ ml: 1 }} />}
              endIcon={<></>}
              onClick={discard}
            >
              Verwerfen
            </CustomButton>
          )}
          <div onClick={handleSubmit(submit)}>
            {submitButton ?? (
              <InteractionButton
                projectName={projectName}
                interactionType={InteractionType.COMMENT_SEND}
                disabled={!isDirty || !isValid}
              />
            )}
          </div>
        </Stack>
      </>
    );
  }
};

export default WriteCommentCard;

const textFieldStyles = {
  width: '100%',
  maxWidth: '450px',
  '& .MuiInputBase-root': {
    p: '22px 24px',
    color: 'text.primary',
    display: 'block',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': {
      borderColor: 'text.primary',
    },
  },
};

const buttonWrapperStyles: SxProps = {
  justifyContent: 'end',
};
