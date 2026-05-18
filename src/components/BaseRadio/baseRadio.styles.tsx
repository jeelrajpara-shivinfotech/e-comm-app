import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export const baseRadioStyles = StyleSheet.create({
  container: { marginBottom: 16, width: '100%' },
  label: { marginBottom: 8, fontSize: 14, color: colors.black },
  radioGroup: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  outerCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.red,
  },
  radioLabel: { fontSize: 14, color: colors.black },
  errorText: { color: colors.dangerRed, fontSize: 12, marginTop: 4 },
});
