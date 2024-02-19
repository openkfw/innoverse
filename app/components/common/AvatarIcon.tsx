import React, { CSSProperties, LegacyRef } from 'react';
import Image from 'next/image';

import Avatar from '@mui/material/Avatar';

import { User, UserSession } from '@/common/types';

import AvatarInitialsIcon from './AvatarInitialsIcon';

interface AvatarIconProps {
  user: User | UserSession;
  size?: number;
  index?: number;
  allowAnimation?: boolean;
}

const hoverStyle: CSSProperties = {
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out',
  marginRight: '-16px',
};

const AvatarIcon = React.forwardRef(function AvatarIcon(props: AvatarIconProps, ref: LegacyRef<HTMLDivElement>) {
  const { user, size = 40, index, allowAnimation = false, ...restProps } = props;
  const appliedStyle = allowAnimation ? { ...hoverStyle, zIndex: index } : { zIndex: index };

  return (
    <div
      {...restProps}
      ref={ref}
      style={appliedStyle}
      onMouseOverCapture={(e) => {
        if (allowAnimation) e.currentTarget.style.transform = 'translateX(-8px)';
      }}
      onMouseOutCapture={(e) => {
        if (allowAnimation) e.currentTarget.style.transform = 'translateX(0px)';
      }}
    >
      {user.image ? (
        <Avatar sx={{ width: size, height: size, border: '2px solid white' }}>
          <Image src={user.image} alt="avatar" fill sizes="33vw" />
        </Avatar>
      ) : (
        <AvatarInitialsIcon name={user.name} size={size} sx={{ border: '2px solid white' }} />
      )}
    </div>
  );
});

export default AvatarIcon;
