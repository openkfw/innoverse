import CheckIcon from '@mui/icons-material/Check';

import { User } from '@/common/types';
import { CommentCardHeader } from '@/components/common/CommentCardHeader';
import CustomButton from '@/components/common/CustomButton';
import WriteTextCard from '@/components/common/editing/writeText/WriteTextCard';
import * as m from '@/src/paraglide/messages.js';

interface WriteCommentCardProps {
  content: { author: User; updatedAt: Date; comment: string; anonymous?: boolean };
  onSubmit: (updatedText: string) => Promise<void>;
  onDiscard: ({ isDirty }: { isDirty: boolean }) => void;
}

export const WriteCommentCard = ({ content, onSubmit, onDiscard }: WriteCommentCardProps) => {
  return (
    <>
      <CommentCardHeader content={content} />
      <WriteTextCard
        onSubmit={onSubmit}
        onDiscard={onDiscard}
        defaultValues={{ text: content.comment }}
        disableAvatar
        sx={{ mt: 2 }}
        submitButton={
          <CustomButton
            themeVariant="secondary"
            sx={{ mr: 0 }}
            style={{ marginRight: 0 }}
            startIcon={<CheckIcon style={{ marginRight: 0 }} sx={{ ml: 1, pr: 0 }} />}
            endIcon={<></>}
          >
            {m.components_newsPage_cards_common_writeCommentCard_done()}
          </CustomButton>
        }
      />
    </>
  );
};
