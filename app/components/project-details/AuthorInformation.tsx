import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { User } from '@/common/types';
import { UserAvatar } from '@/components/common/UserAvatar';
import * as m from '@/src/paraglide/messages.js';
import { openWebex } from '@/utils/openWebex';

import InteractionButton, { InteractionType } from '../common/InteractionButton';

interface UserInformationProps {
  user: User;
  projectName: string;
}

export const UserInformation = (props: UserInformationProps) => {
  const { user, projectName } = props;

  return (
    <Stack direction="row" justifyContent="space-between" flexWrap={'wrap'} pt={4}>
      <Stack direction="column" sx={{ marginRight: 3 }}>
        <Stack direction="row" spacing={1} sx={{ marginBottom: 1 }}>
          <UserAvatar user={user} size={48} projectName={projectName} />
          <Stack>
            <Typography variant="body2" color="text.primary" sx={{ ml: '16px' }}>
              {user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ ml: '16px' }}>
              {user.role}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" pb={2} spacing={1} sx={{ m: 0 }} mt={2}>
          <Typography variant="caption" color="text.primary">
            {user.department}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1} flexWrap={'wrap'} sx={{ mb: 2 }}>
        <InteractionButton
          projectName={projectName}
          interactionType={InteractionType.COMMENT}
          tooltip={m.components_projectdetails_authorinformation_chatWebex()}
          onClick={() => openWebex(user.email)}
          sx={{ mb: 1, mr: 1 }}
          ariaLabel="Chat via Webex"
        />
      </Stack>
    </Stack>
  );
};
