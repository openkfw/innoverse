const Icon = ({ color = 'black', width = 17, height = 9 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
    <path d="M16.4165 0.541626H9.2915V2.12496H16.4165V0.541626Z" fill="black" fillOpacity="0.54" />
    <path d="M16.4165 6.875H9.2915V8.45833H16.4165V6.875Z" fill="black" fillOpacity="0.54" />
    <path d="M16.4165 3.70825H11.6665V5.29159H16.4165V3.70825Z" fill="black" fillOpacity="0.54" />
    <path
      d="M9.29159 4.49996L5.33325 0.541626V3.70829H0.583252V5.29163H5.33325V8.45829L9.29159 4.49996Z"
      fill={color}
      fillOpacity="0.54"
    />
  </svg>
);

export default Icon;
