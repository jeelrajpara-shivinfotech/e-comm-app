import Svg, { Path, SvgProps } from 'react-native-svg';

export const FilterIcon = (props: SvgProps) => (
  <Svg
    width={18}
    height={12}
    viewBox="0 0 18 12"
    fill="none"
    {...props}
  >
    <Path d="M7 12H11V10H7V12ZM0 0V2H18V0H0ZM3 7H15V5H3V7Z" fill="#222222" />
  </Svg>
);
