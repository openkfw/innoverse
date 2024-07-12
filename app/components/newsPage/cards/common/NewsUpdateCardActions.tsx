import { useUser } from '@/app/contexts/user-context';
import { ProjectUpdate } from '@/common/types';
import { EditControls } from '@/components/common/editing/controls/EditControls';
import { ResponseControls } from '@/components/common/editing/controls/ResponseControl';
import { NewsCardControls } from '@/components/newsPage/cards/common/NewsCardControls';

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
    <NewsCardControls>
      {userIsAuthor && <EditControls onEdit={onEdit} onDelete={onDelete} />}
      <ResponseControls onResponse={onResponse} />
    </NewsCardControls>
  );
};
