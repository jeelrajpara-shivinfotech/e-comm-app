import { StyleSheet } from "react-native";
import { colors } from "../../theme";
import Typography from "../../theme/fonts";

export const baseSelectStyles = StyleSheet.create({
  container: { marginBottom: 20, width: '100%' },
  inputWrapper: {
    backgroundColor: colors.white,
    borderRadius: 4,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    minHeight: 64,
    borderColor: colors.white
  },
  focusedWrapper: {
    borderColor: colors.black,
  },
  errorWrapper: {
    borderColor: colors.red,
  },
  successWrapper: {
    borderColor: colors.green,
  },
  content: {
    flex: 1,
    height: 64,
    justifyContent: "center",
    position: 'relative',
  },
  label: {
    ...Typography.regular14,
  },
  dropdown: {
    height: 24,
    width: '100%',
    padding: 0,
  },
  placeholderStyle: {
    fontSize: 14,
    color: colors.black,
    opacity: 0.4
  },
  selectedTextStyle: {
    ...Typography.regular14,
    color: colors.black,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
  errorText: { 
    ...Typography.regular14,
    color: colors.red,
    marginTop: 4,
    marginLeft: 16,
  },
  iconRight: {
    marginLeft: 12,
  },
});