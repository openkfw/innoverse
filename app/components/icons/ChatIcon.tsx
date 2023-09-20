const Icon = ({ color = 'black', width = 19, height = 19 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
    <path
      d="M2.84318 14.437L2.94501 14.0264L2.64631 13.7269C1.44423 12.5214 0.75 11.0202 0.75 9.40625C0.75 5.69464 4.51389 2.4375 9.5 2.4375C14.4861 2.4375 18.25 5.69464 18.25 9.40625C18.25 13.1179 14.4861 16.375 9.5 16.375C8.16769 16.375 6.90994 16.1287 5.7785 15.7031L5.38005 15.5532L5.0471 15.8185C4.33226 16.388 3.02853 17.2337 1.31125 17.4877C1.38811 17.3836 1.46817 17.2717 1.54975 17.1529C2.02067 16.467 2.58024 15.4971 2.84318 14.437Z"
      stroke={color}
      strokeOpacity="0.56"
      strokeWidth="1.5"
    />
  </svg>
);

export default Icon;