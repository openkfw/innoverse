import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { useUser } from '@/app/contexts/user-context';
import { ProjectUpdate } from '@/common/types';
import { EditControls } from '@/components/common/editing/controls/EditControls';
import { ResponseControls } from '@/components/common/editing/controls/ResponseControl';
import { NewsCardActionsWrapper } from '@/components/newsPage/cards/common/NewsCardActionsWrapper';

interface UpdateCardActionsProps {
  update: ProjectUpdate;
  onDelete: () => void;
  onEdit: () => void;
  onResponse: () => void;
}

export const UpdateCardActions = (props: UpdateCardActionsProps) => {
  const { update, onDelete, onEdit, onResponse } = props;
  const { user } = useUser();

  const userIsAuthor = user?.providerId === update.author.providerId;

  return (
    <NewsCardActionsWrapper>
      <Box>
        <Stack direction={'row'}>
          {userIsAuthor && <EditControls onEdit={onEdit} onDelete={onDelete} />}
          <ResponseControls onResponse={onResponse} />
        </Stack>
      </Box>
    </NewsCardActionsWrapper>
  );
};
