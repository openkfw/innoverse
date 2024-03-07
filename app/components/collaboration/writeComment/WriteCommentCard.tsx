'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';

import { useUser } from '@/app/contexts/user-context';
import { errorMessage } from '@/components/common/CustomToast';

import AvatarIcon from '../../common/AvatarIcon';
import { MultilineTextInputField } from '../../common/form/MultilineTextInputField';
import InteractionButton, { InteractionType } from '../../common/InteractionButton';

import formFieldNames from './formFields';
import { CommentFormValidationSchema, formValidationSchema } from './validationSchema';

interface WriteCommentCardProps {
  projectName: string;
  handleComment: (comment: string) => Promise<void>;
  sx?: SxProps;
}

interface CommentFormData {
  comment: string;
}

const { COMMENT } = formFieldNames;
const defaultValues = { [formFieldNames.COMMENT]: '' };

const WriteCommentCard = ({ sx, projectName, handleComment }: WriteCommentCardProps) => {
  const { user } = useUser();
  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isValid },
  } = useForm<CommentFormData>({
    defaultValues,
    resolver: zodResolver(formValidationSchema),
  });
  const placeholder =
    'Teil deine Ratschläge und Gedanken zu diesem Thema, damit deine Kollegen von deiner Expertise profitieren können.';

  const onSubmit: SubmitHandler<CommentFormValidationSchema> = async (data) => {
    try {
      await handleComment(data.comment);
      reset();
    } catch (error) {
      console.error('Failed to submit comment:', error);
      errorMessage({ message: 'Failed to submit your comment. Please try again.' });
    }
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
              endAdornment={
                <Box sx={buttonWrapperStyles}>
                  <InteractionButton
                    projectName={projectName}
                    onClick={handleSubmit(onSubmit)}
                    interactionType={InteractionType.COMMENT_SEND}
                    disabled={!isDirty || !isValid}
                  />
                </Box>
              }
            />
          </form>
        </Stack>
      )}
    </>
  );
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
  marginLeft: 'auto',
  width: 'fit-content',
  marginTop: '0.5em',
};
