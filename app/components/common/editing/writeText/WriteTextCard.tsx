'use client';

import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';

import { useUser } from '@/app/contexts/user-context';
import { fetchEmailsByUsernames } from '@/components/collaboration/comments/actions';
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
  const [loading, setLoading] = useState(false);
  const appInsights = useAppInsightsContext();
  const placeholder = m.components_common_editing_writetext_writeTextCard_placeholder();

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
      setLoading(true);

      const emails = await fetchEmailsByUsernames(
        Array.from(new Set(data?.text.matchAll(mentionRegex)), (match) => match[1]),
      );

      if (emails.length > 0) {
        // todo - enable email sending
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
    } finally {
      setLoading(false);
    }
  };

  const discard = () => {
    onDiscard && onDiscard({ isDirty: formState.isDirty });
  };

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

          {loading ? (
            <IconButton disabled>
              <CircularProgress size={32} color="primary" aria-label="loading" />
            </IconButton>
          ) : (
            <div onClick={form.handleSubmit(submit)}>
              {submitButton ?? (
                <InteractionButton
                  projectName={metadata?.projectName}
                  interactionType={InteractionType.COMMENT_SEND}
                  disabled={!formState.isDirty || !formState.isValid || disabled}
                />
              )}
            </div>
          )}
        </Stack>
      </>
    );
  }
};

export default WriteTextCard;

const buttonWrapperStyles: SxProps = {
  justifyContent: 'end',
};
