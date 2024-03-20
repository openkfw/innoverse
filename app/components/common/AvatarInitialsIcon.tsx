import React from 'react';

import Avatar from '@mui/material/Avatar';
import { SxProps } from '@mui/material/styles';

interface AvatarInitialsIcon {
  name: string;
  size?: number;
  sx?: SxProps;
}

const AvatarInitialsIcon = (props: AvatarInitialsIcon) => {
  const { name, sx, size = 40 } = props;

  const getInitials = () => {
    const [firstName, lastName] = name.split(' ');
    if (firstName && lastName) {
      return firstName.charAt(0) + lastName.charAt(0);
    }
    return firstName.charAt(0);
  };

  const avatarStyle = {
    width: size,
    height: size,
    p: 0.6,
    fontSize: `${size * 0.025}rem`,
    ...sx,
  };

  return (
    <Avatar sx={avatarStyle} alt={name}>
      {getInitials()}
    </Avatar>
  );
};

export default AvatarInitialsIcon;
