const Icon = ({ color = 'black', width = 24, height = 25, disabled = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
    <g opacity={disabled ? '0.4' : '1'}>
      <path
        d="M2 12.5C2 18.02 6.48 22.5 12 22.5C17.52 22.5 22 18.02 22 12.5C22 6.98 17.52 2.5 12 2.5C6.48 2.5 2 6.98 2 12.5ZM20 12.5C20 16.92 16.42 20.5 12 20.5C7.58 20.5 4 16.92 4 12.5C4 8.08 7.58 4.5 12 4.5C16.42 4.5 20 8.08 20 12.5ZM8 12.5L12 8.5L13.41 9.91L11.83 11.5H16V13.5H11.83L13.42 15.09L12 16.5L8 12.5Z"
        fill={color}
        fillOpacity="0.56"
      />
    </g>
  </svg>
);

export default Icon;
