const Icon = ({ color = 'black', width = 18, height = 19 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
    <path
      d="M15 2H3C2.175 2 1.5075 2.675 1.5075 3.5L1.5 17L4.5 14H15C15.825 14 16.5 13.325 16.5 12.5V3.5C16.5 2.675 15.825 2 15 2ZM15 12.5H3.8775L3.435 12.9425L3 13.3775V3.5H15V12.5ZM4.5 9.5H6V11H4.5V9.5ZM4.5 7.25H6V8.75H4.5V7.25ZM4.5 5H6V6.5H4.5V5ZM7.5 9.5H11.25V11H7.5V9.5ZM7.5 7.25H13.5V8.75H7.5V7.25ZM7.5 5H13.5V6.5H7.5V5Z"
      fill={color}
      fillOpacity="0.54"
    />
  </svg>
);

export default Icon;
