import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect, SvgProps } from 'react-native-svg';

const ChevronDown = (props : SvgProps) => (
  <Svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <G clipPath="url(#clip0_982_980)">
      <Path
        d="M4.94 5.72665L8 8.77999L11.06 5.72665L12 6.66665L8 10.6667L4 6.66665L4.94 5.72665Z"
        fill="black"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_982_980">
        <Rect width={16} height={16} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default ChevronDown;
