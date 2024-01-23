const Icon = ({ color = 'black', width = 17, height = 9 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
    <path d="M16.4166 0.541626H9.29163V2.12496H16.4166V0.541626Z" fill="black" fillOpacity="0.54" />
    <path d="M16.4166 6.875H9.29163V8.45833H16.4166V6.875Z" fill="black" fillOpacity="0.54" />
    <path d="M16.4166 3.70825H11.6666V5.29159H16.4166V3.70825Z" fill="black" fillOpacity="0.54" />
    <path
      d="M9.29165 4.49996L5.33331 0.541626V3.70829H0.583313V5.29163H5.33331V8.45829L9.29165 4.49996Z"
      fill={color}
      fillOpacity="0.54"
    />
  </svg>
);

export default Icon;
