'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';

import { useUser } from '@/app/contexts/user-context';
import CustomButton from '@/components/common/CustomButton';
import { errorMessage } from '@/components/common/CustomToast';
import { UserAvatarProps } from '@/components/common/UserAvatar';
import * as m from '@/src/paraglide/messages.js';
import { mentionRegex } from '@/utils/mentions/formatMentionToText';

import AvatarIcon from '../../AvatarIcon';
import MultilineMentionInput from '../../form/MultilineMentionInput';
import InteractionButton, { InteractionType } from '../../InteractionButton';

import formFieldNames from './formFields';
import { formValidationSchema, TextFormValidationSchema } from './validationSchema';

interface WriteTextCardProps {
  onSubmit: (text: string) => Promise<void>;
  onDiscard?: ({ isDirty }: { isDirty: boolean }) => void;
  projectName?: string;
  defaultValues?: {
    text: string;
  };
  metadata?: {
    projectName?: string;
  };
  avatar?: UserAvatarProps;
  submitButton?: React.ReactNode;
  disableAvatar?: boolean;
  disabled?: boolean;
  sx?: SxProps;
}

interface TextFormData {
  text: string;
}

const WriteTextCard = ({
  metadata,
  onSubmit,
  onDiscard,
  submitButton,
  defaultValues,
  disableAvatar = false,
  disabled = false,
  avatar,
  sx,
}: WriteTextCardProps) => {
  const { user } = useUser();

  const appInsights = useAppInsightsContext();

  const form = useForm<TextFormData>({
    defaultValues: {
      [formFieldNames.TEXT]: defaultValues?.text ?? '',
    },
    resolver: zodResolver(formValidationSchema),
  });

  const formState = form.formState;

  const submit: SubmitHandler<TextFormValidationSchema> = async (data) => {
    try {
      if (disabled) return;

      let match;
      const mentionedEmails = new Set();

      while ((match = mentionRegex.exec(data.text)) !== null) {
        const email = match[2];
        if (email) {
          mentionedEmails.add(email);
        }
      }

      const uniqueEmails = Array.from(mentionedEmails);
      if (uniqueEmails.length > 0) {
        // Send email to all uniqueEmails in the comment
      }

      await onSubmit(data.text);
      form.reset();
    } catch (error) {
      console.error('Failed to submit text:', error);
      errorMessage({ message: m.components_common_editing_writetext_writeTextCard_failedSubmit() });
      appInsights.trackException({
        exception: new Error('Failed to submit text.', { cause: error }),
        severityLevel: SeverityLevel.Error,
      });
    }
  };

  const discard = () => {
    onDiscard && onDiscard({ isDirty: formState.isDirty });
  };

  const placeholder = m.components_common_editing_writetext_writeTextCard_placeholder();

  return (
    <>
      {user && (
        <Stack direction="row" spacing={1} sx={sx}>
          {!disableAvatar && <AvatarIcon user={user} size={32} {...avatar} />}
          <form style={{ width: '100%' }}>
            <MultilineMentionInput
              rows={4}
              control={form.control}
              placeholder={placeholder}
              name={formFieldNames.TEXT}
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
              {m.components_common_editing_writetext_writeTextCard_throw()}
            </CustomButton>
          )}
          <div onClick={form.handleSubmit(submit)}>
            {submitButton ?? (
              <InteractionButton
                projectName={metadata?.projectName}
                interactionType={InteractionType.COMMENT_SEND}
                disabled={!formState.isDirty || !formState.isValid || disabled}
              />
            )}
          </div>
        </Stack>
      </>
    );
  }
};

export default WriteTextCard;

const buttonWrapperStyles: SxProps = {
  justifyContent: 'end',
};
