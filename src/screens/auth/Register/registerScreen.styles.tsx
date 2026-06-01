import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';
import Typography from '../../../theme/fonts';

export const registerScreenStyles = StyleSheet.create({
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
    color: colors.black,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subHeaderText: {
    ...Typography.regular16,
    color: colors.black,
    marginBottom: 32,
    fontWeight: 400,
  },
  sectionLabel: {
    ...Typography.regular14,
    color: colors.red,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionDivider: {
    height: 2,
    backgroundColor: colors.gray,
    opacity: 0.1,
    marginBottom: 20,
    marginTop: 4,
  },
  formContainer: {
    width: '100%',
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  signInText: {
    ...Typography.regular16,
    color: colors.black,
    marginRight: 4,
  },
  signInLink: {
    ...Typography.regular16,
    color: colors.red,
    fontWeight: '700',
  },
  signUpButton: {
    marginTop: 24,
    shadowColor: colors.red,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
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
    opacity: 0.1,
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
