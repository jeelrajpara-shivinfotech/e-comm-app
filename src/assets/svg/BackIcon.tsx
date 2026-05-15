import * as React from "react";
import Svg, { Rect, Path, Circle, SvgProps } from "react-native-svg";
import { colors } from "../../theme";
const BackIcon = (props : SvgProps) => (
<Svg
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color="currentColor"
    fill="none"
    stroke={colors.black}
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M17 4L8.66943 10.0405C6.44352 11.6545 6.44353 12.3455 8.66943 13.9595L17 20" />
  </Svg>
);
export default BackIcon;
