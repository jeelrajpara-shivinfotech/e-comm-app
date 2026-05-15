import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const CloseIcon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      d="M18 6L6 18M6 6L18 18"
      stroke="#F01F0E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default CloseIcon
