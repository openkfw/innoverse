import React, { CSSProperties, LegacyRef } from 'react';
import Image, { StaticImageData } from 'next/image';

import Avatar from '@mui/material/Avatar';

interface AvatarIconProps {
  src: StaticImageData;
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
  const { src, size = 40, index, allowAnimation, ...restProps } = props;
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
      <Avatar sx={{ width: size, height: size, border: '2px solid white' }}>
        <Image src={src} alt="avatar" fill sizes="33vw" />
      </Avatar>
    </div>
  );
});

export default AvatarIcon;
