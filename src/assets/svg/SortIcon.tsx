import Svg, { Path, SvgProps } from 'react-native-svg';
import { colors } from '../../theme';

export const SortIcon = (props: SvgProps) => (
  <Svg width={props.width || 14} height={props.height || 18} viewBox="0 0 14 18" fill="none" {...props}>
    <Path
      d="M11 14.01V7H9V14.01H6L10 18L14 14.01H11ZM4 0L0 3.99H3V11H5V3.99H8L4 0Z"
      fill={colors.black}
    />
  </Svg>
);
