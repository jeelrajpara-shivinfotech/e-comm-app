import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../theme';
import Typography from '../../../theme/fonts';

export const forgotPasswordScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginVertical: 60,
  },
  backButton: {
    marginBottom: 20,
  },
  headerText: {
    ...Typography.regular34,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 60,
  },
  descriptionText: {
    ...Typography.regular16,
    color: colors.black,
    marginBottom: 16,
    lineHeight: 20,
    fontWeight: 500
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 32,
  },
  sendButton: {
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
});
