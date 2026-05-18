import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { SvgProps } from "react-native-svg"
import { colors } from "../../theme"

const ArrowRight = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      d="M5 12H19M19 12L13 6M19 12L13 18"
      stroke={props.color || colors.dangerRed}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default ArrowRight
