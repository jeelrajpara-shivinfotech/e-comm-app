import { StyleSheet } from "react-native";
import { colors } from "../../theme";
import Typography, { screenHeight } from "../../theme/fonts";

export const homeScreenStyles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.white
  },
  contentContainer: {
    paddingBottom: 100,
  },
  banner: {
    width: '100%',
    height: screenHeight * 0.65,
    justifyContent: 'flex-end',
  },
  bannerContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    zIndex: 1,
  },
  bannerTitle: {
    ...Typography.regular34,
    fontSize: 48, 
    fontWeight: '900',
    color: colors.white,
    lineHeight: 52,
    marginBottom: 20,
  },
  checkButton: {
    width: 160,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  sectionContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    ...Typography.regular34,
    color: colors.black,
    marginBottom: 4,
    fontWeight: '600',
  },
  sectionSubtitle: {
    ...Typography.regular18,
    color: colors.gray,
    fontWeight : 500
  },
  viewAllText: {
    ...Typography.regular18,
    color: colors.black,
    fontWeight : 500
  },
  productList: {
    paddingRight: 20,
  },
  productCard: {
    width: 150,
    marginRight: 15,
  },
  productImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.lightGray,
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.black,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    ...Typography.regular12,
    color: colors.white,
    textTransform: "uppercase"
  },
  productBrand: {
    ...Typography.regular16,
    color: colors.black,
    marginBottom: 2,
  },
  productName: {
    ...Typography.regular18,
    color: colors.black,
    marginBottom: 2,
    fontWeight : 600
  },
  productPrice: {
    ...Typography.regular16,
    color: colors.black,
  }
});