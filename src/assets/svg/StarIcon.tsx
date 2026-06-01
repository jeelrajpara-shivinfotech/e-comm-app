import Svg, { Path, SvgProps } from "react-native-svg";

export const StarIcon = ({ filled }: { filled: boolean } , props : SvgProps) => (
  <Svg
    width={props.width || 14}
    height={props.height || 14}
    viewBox="0 0 24 24"
    fill={filled ? '#FFC107' : 'none'}
  >
    <Path
      d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
      stroke="#FFC107"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);