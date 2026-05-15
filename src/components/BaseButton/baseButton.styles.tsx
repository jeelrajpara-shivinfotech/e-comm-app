import { StyleSheet } from "react-native";
import { colors } from "../../theme";

export const baseButtonStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    paddingHorizontal: 20,
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    textTransform: "uppercase",
  },
  // Variants
  primary: {
    backgroundColor: colors.red,
    shadowColor: colors.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  secondary: {
    backgroundColor: colors.black,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.red,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  danger: {
    backgroundColor: "#FF4D4F",
  },
  // Sizes
  xs: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  sm: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  md: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  lg: {
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  // Text Styles per Variant
  textPrimary: {
    color: colors.white,
  },
  textSecondary: {
    color: colors.white,
  },
  textOutline: {
    color: colors.red,
  },
  textGhost: {
    color: colors.red,
  },
  textDanger: {
    color: colors.white,
  },
  // Text Sizes
  textXs: {
    fontSize: 12,
  },
  textSm: {
    fontSize: 14,
  },
  textMd: {
    fontSize: 16,
  },
  textLg: {
    fontSize: 18,
  },
  // Helpers
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  loadingContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  hiddenContent: {
    opacity: 0,
  },
});