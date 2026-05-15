import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../theme';
import Typography from '../../../theme/fonts';

const { width } = Dimensions.get('window');

export const registerScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginVertical: 60,
  },
  backButton: {
    marginBottom: 40,
  },
  headerText: {
    ...Typography.regular34,
    color: colors.black,
    marginBottom: 60,
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 8,
  },
  alreadyHaveAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  alreadyHaveAccountText: {
    ...Typography.regular18,
    color: colors.black,
    marginRight: 4,
    fontWeight: 500,
  },
  signUpButton: {
    marginTop: 32,
    shadowColor: colors.red,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  socialContainer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 40,
  },
  socialText: {
    ...Typography.regular18,
    color: colors.black,
    marginBottom: 12,
    fontWeight: 500,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    backgroundColor: colors.white,
    width: 92,
    height: 64,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
