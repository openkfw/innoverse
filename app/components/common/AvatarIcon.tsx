import React, { CSSProperties, LegacyRef } from 'react';
import Image from 'next/image';

import Avatar from '@mui/material/Avatar';

import { User, UserSession } from '@/common/types';
import * as m from '@/src/paraglide/messages.js';

import AvatarInitialsIcon from './AvatarInitialsIcon';

interface AvatarIconProps {
  user: User | UserSession;
  size?: number;
  index?: number;
  allowAnimation?: boolean;
  disableTransition?: boolean;
}

const hoverStyle: CSSProperties = {
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out',
};

const AvatarIcon = React.forwardRef(function AvatarIcon(props: AvatarIconProps, ref: LegacyRef<HTMLDivElement>) {
  const { user, size = 40, index, allowAnimation = false, disableTransition = false, ...restProps } = props;
  const appliedStyle = allowAnimation ? { ...hoverStyle, zIndex: index } : { zIndex: index };

  return (
    <div
      {...restProps}
      ref={ref}
      style={appliedStyle}
      onMouseOverCapture={(e) => {
        if (allowAnimation && !disableTransition) e.currentTarget.style.transform = 'translateX(-8px)';
      }}
      onMouseOutCapture={(e) => {
        if (allowAnimation && !disableTransition) e.currentTarget.style.transform = 'translateX(0px)';
      }}
    >
      {user.image ? (
        <Avatar sx={{ width: size, height: size }}>
          <Image src={user.image} alt={m.components_common_avatarIcon_imageAlt()} fill sizes="33vw" />
        </Avatar>
      ) : (
        <AvatarInitialsIcon name={user.name} size={size} sx={{ border: '2px solid white' }} />
      )}
    </div>
  );
});

export default AvatarIcon;
