import { StyleSheet } from "react-native";
import { colors } from "../../theme";

export const baseTextInputStyles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: "100%",
  },
  inputWrapper: {
    backgroundColor: colors.white,
    borderRadius: 4,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "transparent",
    minHeight: 64,
  },
  focusedWrapper: {
    borderColor: colors.black,
  },
  errorWrapper: {
    borderColor: colors.red,
  },
  successWrapper: {
    borderColor: "#2AA952",
  },
  content: {
    flex: 1,
    height: 64,
    justifyContent: "center",
    position: 'relative',
  },
  label: {
    fontWeight: "400",
  },
  input: {
    fontSize: 14,
    color: colors.black,
    fontWeight: "500",
    padding: 0,
    width: '100%',
  },
  errorText: {
    fontSize: 11,
    color: colors.red,
    marginTop: 4,
    marginLeft: 16,
  },
  iconRight: {
    marginLeft: 12,
  },
});
