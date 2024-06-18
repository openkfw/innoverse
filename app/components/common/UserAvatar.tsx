import Box from '@mui/material/Box';
import { SxProps } from '@mui/material/styles';

import { User } from '@/common/types';
import AvatarIcon from '@/components/common/AvatarIcon';
import { StyledTooltip } from '@/components/common/StyledTooltip';
import { UserTooltip } from '@/components/common/UserTooltip';

export interface UserAvatarProps {
  size: number;
  allowAnimation?: boolean;
  disableTransition?: boolean;
  sx?: SxProps;
}

type UserAvatarInternalProps = UserAvatarProps & {
  user: User;
  projectName?: string;
};

export const UserAvatar = ({
  user,
  size: avatarSize,
  allowAnimation = false,
  disableTransition = false,
  projectName,
  sx,
}: UserAvatarInternalProps) => {
  return (
    <Box sx={sx}>
      <StyledTooltip
        arrow
        key={user.id}
        title={<UserTooltip user={user} projectName={projectName} />}
        placement="bottom"
      >
        <AvatarIcon
          user={user}
          size={avatarSize}
          allowAnimation={allowAnimation}
          disableTransition={disableTransition}
        />
      </StyledTooltip>
    </Box>
  );
};
