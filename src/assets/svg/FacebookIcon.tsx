import * as React from "react"
import Svg, { Path } from "react-native-svg"

const FacebookIcon = (props: any) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.03 4.42 11.02 10.12 11.91v-8.43H7.08v-3.48h3.04V9.41c0-3.01 1.79-4.67 4.52-4.67 1.31 0 2.68.23 2.68.23v2.96h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.33l-.53 3.48h-2.8V24C19.58 23.1 24 18.1 24 12.07z"
      fill="#1877F2"
    />
    <Path
      d="M16.75 15.55l.53-3.48h-3.33v-2.26c0-.95.46-1.88 1.95-1.88h1.51V4.97s-1.37-.23-2.68-.23c-2.73 0-4.52 1.66-4.52 4.67v2.66H7.08v3.48h3.04v8.43c.61.1 1.23.14 1.87.14.65 0 1.28-.05 1.88-.14v-8.43h2.8z"
      fill="white"
    />
  </Svg>
)

export default FacebookIcon
