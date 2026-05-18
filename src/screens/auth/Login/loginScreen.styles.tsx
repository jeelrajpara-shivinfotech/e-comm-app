import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';
import Typography from '../../../theme/fonts';

export const loginScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 48,
    paddingTop: 40,
  },
  backButton: {
    marginBottom: 24,
  },
  headerText: {
    ...Typography.regular34,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 4,
  },
  subHeaderText: {
    ...Typography.regular16,
    color: colors.black,
    marginBottom: 32,
    fontWeight: 400
  },
  formContainer: {
    width: '100%',
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  forgotPasswordText: {
    ...Typography.regular16,
    color: colors.red,
    fontWeight: '500',
    marginRight: 4,
  },
  loginButton: {
    marginTop: 24,
    shadowColor: colors.red,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  signUpText: {
    ...Typography.regular16,
    color: colors.black,
    marginRight: 4,
  },
  signUpLink: {
    ...Typography.regular16,
    color: colors.red,
    fontWeight: '700',
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.black,
    opacity: 0.1
  },
  orText: {
    ...Typography.regular14,
    color: colors.gray,
    marginHorizontal: 12,
  },
  socialContainer: {
    alignItems: 'center',
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    backgroundColor: colors.white,
    width: 92,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
});
