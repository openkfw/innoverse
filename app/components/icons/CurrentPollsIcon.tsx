const Icon = ({ color = '#A4B419', width = 40, height = 40 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
    <path
      d="M6.66665 6.66671H33.3333V26.6667H8.61665L6.66665 28.6167V6.66671ZM6.66665 3.33337C4.83331 3.33337 3.34998 4.83337 3.34998 6.66671L3.33331 36.6667L9.99998 30H33.3333C35.1666 30 36.6666 28.5 36.6666 26.6667V6.66671C36.6666 4.83337 35.1666 3.33337 33.3333 3.33337H6.66665Z"
      fill={color}
    />
    <path d="M25.5555 16.6667L25.5555 23.3334H28.8889L28.8889 16.6667H25.5555Z" fill={color} />
    <path d="M18.3333 10V23.3334H21.6666V10H18.3333Z" fill={color} />
    <path d="M11.1111 12.2223L11.1111 23.3334H14.4444V12.2223H11.1111Z" fill={color} />
  </svg>
);

export default Icon;
