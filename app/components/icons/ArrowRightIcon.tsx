import { useState } from 'react';

const Icon = ({ color = '#41484C', width = 24, height = 25, disabled = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const finalColor = disabled ? color : isHovered ? '#398357' : color;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <g opacity={disabled ? '0.4' : '1'}>
        <path
          d="M22 12.5C22 6.98 17.52 2.5 12 2.5C6.48 2.5 2 6.98 2 12.5C2 18.02 6.48 22.5 12 22.5C17.52 22.5 22 18.02 22 12.5ZM4 12.5C4 8.08 7.58 4.5 12 4.5C16.42 4.5 20 8.08 20 12.5C20 16.92 16.42 20.5 12 20.5C7.58 20.5 4 16.92 4 12.5ZM16 12.5L12 16.5L10.59 15.09L12.17 13.5H8V11.5H12.17L10.58 9.91L12 8.5L16 12.5Z"
          fill={finalColor}
        />
      </g>
    </svg>
  );
};

export default Icon;
