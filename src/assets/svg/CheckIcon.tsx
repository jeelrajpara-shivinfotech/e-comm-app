import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { SvgProps } from "react-native-svg"

const CheckIcon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      d="M20 6L9 17L4 12"
      stroke={props.stroke || "#2AA952"}
      strokeWidth={props.strokeWidth || "2"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default CheckIcon
