import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../theme';
import Typography from '../../theme/fonts';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const baseBottomDrawerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheetContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: SCREEN_HEIGHT * 0.8,
    paddingBottom: 34,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  handle: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.silver,
    alignSelf: 'center',
    marginTop: 14,
  },
  title: {
    ...Typography.regular14,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 16,
  },
  optionsList: {
    width: '100%',
  },
  optionRow: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  selectedOptionRow: {
    backgroundColor: colors.red,
  },
  optionText: {
    ...Typography.regular16,
    color: colors.black,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: colors.white,
    fontWeight: '600',
  },
});
