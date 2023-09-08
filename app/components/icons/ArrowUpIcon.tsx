const Icon = ({ color = 'black', size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
    <path
      d="M-6.11959e-07 7L4 7L4 14L10 14L10 7L14 7L7 6.11959e-07L-6.11959e-07 7Z"
      fill={color}
      fillOpacity={color == 'black' ? 0.56 : 1}
    />
  </svg>
);

export default Icon;
