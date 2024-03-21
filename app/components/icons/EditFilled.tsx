const Icon = ({ color = '#656565', width = 24, height = 24 }) => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.99878 17.2512V21.0012H6.74878L17.8088 9.94125L14.0588 6.19125L2.99878 17.2512ZM20.7088 7.04125C21.0988 6.65125 21.0988 6.02125 20.7088 5.63125L18.3688 3.29125C17.9788 2.90125 17.3488 2.90125 16.9588 3.29125L15.1288 5.12125L18.8788 8.87125L20.7088 7.04125Z"
      fill={color}
    />
  </svg>
);

export default Icon;
