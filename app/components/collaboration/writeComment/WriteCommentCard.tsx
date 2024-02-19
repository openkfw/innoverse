'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';

import { useUser } from '@/app/contexts/user-context';

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
    await handleComment(data.comment);
    reset();
  };

  return (
    <>
      {user && (
        <Stack direction="row" spacing={3} sx={sx}>
          <AvatarIcon user={user} size={32} />
          <form>
            <MultilineTextInputField
              name={COMMENT}
              control={control}
              placeholder={placeholder}
              rows={6}
              sx={textFieldStyles}
              endAdornment={
                <InteractionButton
                  projectName={projectName}
                  onClick={handleSubmit(onSubmit)}
                  interactionType={InteractionType.COMMENT_SEND}
                  sx={buttonStyles}
                  disabled={!isDirty || !isValid}
                />
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
  borderRadius: '8px',
  width: 450,
  '& .MuiInputBase-root': {
    p: '22px 24px',
    color: 'text.primary',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'text.primary',
    },
  },
};

const buttonStyles = {
  bottom: 22,
  right: 24,
  position: 'absolute',
};
