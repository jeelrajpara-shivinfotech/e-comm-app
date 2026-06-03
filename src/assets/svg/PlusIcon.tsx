import { View, Text } from 'react-native';
import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect, SvgProps } from 'react-native-svg';

const PlusIcon = (props: SvgProps) => (
  <Svg width={props.width || 24} height={props.height || 24} viewBox="0 0 24 24" fill="none" {...props}>
    <G clipPath="url(#clip0_997_1592)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 5V11H5V13H11V19H13V13H19V11H13V5H11Z"
        fill="#9B9B9B"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_997_1592">
        <Rect width={24} height={24} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default PlusIcon;
