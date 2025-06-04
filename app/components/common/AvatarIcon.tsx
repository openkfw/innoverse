import React, { CSSProperties, LegacyRef } from 'react';
import Image from 'next/image';

import MuiAvatar from '@mui/material/Avatar';

import { User, UserSession } from '@/common/types';
import * as m from '@/src/paraglide/messages.js';

import AvatarInitialsIcon from './AvatarInitialsIcon';

interface BaseAvatarIconProps {
  size?: number;
  index?: number;
  allowAnimation?: boolean;
  disableTransition?: boolean;
}

interface AnonymousAvatarProps extends BaseAvatarIconProps {
  anonymous: true;
  user?: undefined;
}

interface KnownUserAvatarProps extends BaseAvatarIconProps {
  anonymous?: false;
  user: User | UserSession;
}

export type AvatarIconProps = AnonymousAvatarProps | KnownUserAvatarProps;

const hoverStyle: CSSProperties = {
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out',
};

const Avatar = (props: AvatarIconProps) => {
  const { size = 40 } = props;

  if (props.anonymous) {
    return <AvatarInitialsIcon name={m.components_common_anonymous_author()} size={size} />;
  }

  const { user } = props;
  if (user.image) {
    return (
      <MuiAvatar sx={{ width: size, height: size }}>
        <Image src={user.image} alt={m.components_common_avatarIcon_imageAlt()} fill sizes="33vw" />
      </MuiAvatar>
    );
  }
  return <AvatarInitialsIcon name={user.name} size={size} />;
};

const AvatarIcon = React.forwardRef(function AvatarIcon(props: AvatarIconProps, ref: LegacyRef<HTMLDivElement>) {
  const { index, allowAnimation = false, disableTransition = false, anonymous: _anonymous, ...refProps } = props;
  const appliedStyle = allowAnimation ? { ...hoverStyle, zIndex: index } : { zIndex: index };

  return (
    <div
      {...refProps}
      ref={ref}
      style={appliedStyle}
      onMouseOverCapture={(e) => {
        if (allowAnimation && !disableTransition) e.currentTarget.style.transform = 'translateX(-8px)';
      }}
      onMouseOutCapture={(e) => {
        if (allowAnimation && !disableTransition) e.currentTarget.style.transform = 'translateX(0px)';
      }}
    >
      <Avatar {...props} />
    </div>
  );
});

export default AvatarIcon;
