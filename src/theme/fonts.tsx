import {Dimensions, PixelRatio} from 'react-native';

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;
const fontScale = PixelRatio.getFontScale();
const getFontSize = (size: number) => size / fontScale;

const Typography = {
  regular16: {
    fontSize: getFontSize(16),
  },
  regular18: {
    fontSize: getFontSize(18),
  },
  regular14: {
    fontSize: getFontSize(14),
  },
  regular10: {
    fontSize: getFontSize(10),
  },
  regular12: {
    fontSize: getFontSize(12),
  },
  regular13: {
    fontSize: getFontSize(13),
  },
  regular17: {
    fontSize: getFontSize(17),
  },
  regular32: {
    fontSize: getFontSize(32),
  },
  regular25: {
    fontSize: getFontSize(25),
  },
  regular30: {
    fontSize: getFontSize(30),
  }, 
  regular34: {
    fontSize: getFontSize(34),
  },
};

export default Typography;