import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';
import Typography from '../../../theme/fonts';

export const forgotPasswordScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 48,
    paddingTop: 80,
  },
  backButton: {
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  headerText: {
    ...Typography.regular34,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 8,
    lineHeight: 34
  },
  descriptionText: {
    ...Typography.regular18,
    color: colors.black,
    marginBottom: 32,
    lineHeight: 24,
    fontWeight: 400,
    marginTop : 50
  },
  formContainer: {
    width: '100%',
  },
  sendButton: {
    marginTop: 24,
    shadowColor: colors.red,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  backToLoginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  backToLoginText: {
    ...Typography.regular16,
    color: colors.black,
    marginRight: 4,
  },
  backToLoginLink: {
    ...Typography.regular16,
    color: colors.red,
    fontWeight: '700',
  },
});
