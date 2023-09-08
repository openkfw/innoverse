import React, { LegacyRef } from 'react';
import Image, { StaticImageData } from 'next/image';

import Avatar from '@mui/material/Avatar';

interface AvatarIconProps {
  src: StaticImageData;
  size?: number;
}

const AvatarIcon = React.forwardRef(function AvatarIcon(props: AvatarIconProps, ref: LegacyRef<HTMLDivElement>) {
  const { src, size = 40 } = props;
  return (
    <div ref={ref} {...props} style={{ marginLeft: '-8px' }}>
      <Avatar sx={{ width: size, height: size, border: '2px solid white' }}>
        <Image src={src} alt="avatar" fill sizes="33vw" />
      </Avatar>
    </div>
  );
});

export default AvatarIcon;
