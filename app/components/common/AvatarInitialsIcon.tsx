import React from 'react';

import { SxProps } from '@mui/material';
import Avatar from '@mui/material/Avatar';

interface AvatarInitialsIcon {
  name: string;
  size?: number;
  sx?: SxProps;
}

const AvatarInitialsIcon = (props: AvatarInitialsIcon) => {
  const { name, sx, size = 40 } = props;

  const getInitials = () => {
    const [firstName, lastName] = name.split(' ');
    return firstName.charAt(0) + lastName.charAt(0);
  };

  const avatarStyle = {
    width: size,
    height: size,
    p: 0.6,
    ...sx,
  };

  return (
    <Avatar sx={avatarStyle} alt={name}>
      {getInitials()}
    </Avatar>
  );
};

export default AvatarInitialsIcon;
