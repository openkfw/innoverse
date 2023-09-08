const Icon = ({ color = 'black', size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
    <path d="M15 8H11V1H5V8H1L8 15L15 8Z" fill={color} fillOpacity={color == 'black' ? 0.56 : 1} />
  </svg>
);

export default Icon;
