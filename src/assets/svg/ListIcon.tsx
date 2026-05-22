import Svg, { Path, SvgProps } from "react-native-svg";
import { colors } from "../../theme";

export const ListIcon = (props: SvgProps) => (
  <Svg
    width={17}
    height={14}
    viewBox="0 0 17 14"
    fill="none"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 9H4V5H0V9ZM0 14H4V10H0V14ZM0 4H4V0H0V4ZM5 9H17V5H5V9ZM5 14H17V10H5V14ZM5 0V4H17V0H5Z"
      fill={colors.black}
    />
  </Svg>
);