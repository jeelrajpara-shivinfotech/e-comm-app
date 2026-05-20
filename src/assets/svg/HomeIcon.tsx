import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect, SvgProps } from 'react-native-svg';
const HomeIcon = (props: SvgProps) => (
  <Svg
    width={30}
    height={30}
    viewBox="0 0 30 30"
    fill="none"
    {...props}
  >
    <G clipPath="url(#clip0_898_1091)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.2941 27V18.5294H17.9412V27H25V15.7059H29.2353L15.1176 3L1 15.7059H5.23529V27H12.2941Z"
        stroke={props.color}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_898_1091">
        <Rect width={30} height={30} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default HomeIcon;
