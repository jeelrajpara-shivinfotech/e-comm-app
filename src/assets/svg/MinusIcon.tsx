import { View, Text } from 'react-native'
import React from 'react'
import Svg, { Rect, SvgProps } from 'react-native-svg';

const MinusIcon = (props : SvgProps) => (
  <Svg
    width={props.width || 24}
    height={props.height || 24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Rect x={5} y={12} width={14} height={2} fill="#9B9B9B" />
  </Svg>
);

export default MinusIcon