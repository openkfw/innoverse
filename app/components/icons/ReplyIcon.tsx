const Icon = ({ color = 'black', width = 24, height = 25 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
    <path
      fill={color}
      fillOpacity="0.54"
      d="M10 9.33469V5.33469L3 12.3347L10 19.3347V15.2347C15 15.2347 18.5 16.8347 21 20.3347C20 15.3347 17 10.3347 10 9.33469Z"
    />
  </svg>
);

export default Icon;
