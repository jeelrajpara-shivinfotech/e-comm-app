import {Dimensions, PixelRatio} from 'react-native';

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;
const fontScale = PixelRatio.getFontScale();
const getFontSize = (size: number) => size / fontScale;

const Typography = {
  // Font sizes with weight 400 (Regular)
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

  // Font sizes with weight 500 (Medium)
  medium8: {
    fontSize: getFontSize(8),
  },
  medium16: {
    fontSize: getFontSize(16),
  },
  medium18: {
    fontSize: getFontSize(18),
  },
  medium20: {
    fontSize: getFontSize(20),
  },
  medium12: {
    fontSize: getFontSize(12),
  },
  medium10: {
    fontSize: getFontSize(10),
  },
  medium14: {
    fontSize: getFontSize(14),
  },
  medium40: {
    fontSize: getFontSize(40),
  },
  medium30: {
    fontSize: getFontSize(30),
  },

  // Font sizes with weight 600 (SemiBold)
  semiBold18: {
    fontSize: getFontSize(18),
  },
  semiBold14: {
    fontSize: getFontSize(14),
  },
  semiBold16: {
    fontSize: getFontSize(16),
  },
  semiBold10: {
    fontSize: getFontSize(10),
  },
  semiBold12: {
    fontSize: getFontSize(12),
  },
  semiBold13: {
    fontSize: getFontSize(13),
  },
  semiBold22: {
    fontSize: getFontSize(22),
  },
  semiBold20: {
    fontSize: getFontSize(20),
  },
  semiBold24: {
    fontSize: getFontSize(24),
  },
  semiBold32: {
    fontSize: getFontSize(32),
  },
  semiBold40: {
    fontSize: getFontSize(40),
  },
  semiBold48: {
    fontSize: getFontSize(48),
  },
  semiBold: {
    fontSize: getFontSize(55),
  },

  // Font sizes with weight 800 (Bold)
  bold24: {
    fontSize: getFontSize(24),
  },
  bold32: {
    fontSize: getFontSize(32),
  },
};

export default Typography;