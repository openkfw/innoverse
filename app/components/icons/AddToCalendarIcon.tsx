const Icon = ({ color = 'black', size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill={color}>
    <path
      id="Vector"
      d="M20.5 3H19.5V1H17.5V3H7.5V1H5.5V3H4.5C3.4 3 2.5 3.9 2.5 5V21C2.5 22.1 3.4 23 4.5 23H20.5C21.6 23 22.5 22.1 22.5 21V5C22.5 3.9 21.6 3 20.5 3ZM20.5 21H4.5V8H20.5V21Z"
      fill={color}
    />
    <path
      id="Vector_2"
      d="M17.5 15.2143H13.2143V19.5H11.7857V15.2143H7.5V13.7857H11.7857V9.5H13.2143V13.7857H17.5V15.2143Z"
      fill={color}
    />
  </svg>
);

export default Icon;
