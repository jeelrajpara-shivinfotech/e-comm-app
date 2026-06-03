import { colors } from '../theme';

export const bagPageConstants = {
  addedToFavourites: 'Added to Favourites',
  favoritedMessage: 'has been favorited!',
  promoApplied: 'Promo Applied',
  promoAppliedMessage: (code: string) => `Discount code "${code}" applied!`,
  invalidPromo: 'Invalid Promo',
  invalidPromoMessage: 'The promo code entered does not exist or is expired.',
  colorLabel: 'Color:',
  sizeLabel: ' Size:',
  currencySymbol: '$',
  addToFavorites: 'Add to favorites',
  deleteFromList: 'Delete from the list',
  myBagTitle: 'My Bag',
  emptyBagMessage: 'Your shopping bag is empty. Start adding items from the Shop!',
  shopNow: 'Shop Now',
  enterPromoPlaceholder: 'Enter your promo code',
  totalAmountLabel: 'Total amount:',
  checkoutBtn: 'CHECK OUT',
  yourPromoCodesTitle: 'Your Promo Codes',
  percentOff: '% off',
  applyBtn: 'Apply',
  emptyString: '',
  bottomTabRoute: 'BottomTab',
  shopScreenRoute: 'ShopScreen',
  shopIndexRoute: 'ShopIndex',
} as const;

export interface StaticPromoCode {
  id: string;
  discount: number;
  label: string;
  title: string;
  code: string;
  validity: string;
  color: string;
}

export const STATIC_PROMO_CODES: StaticPromoCode[] = [
  {
    id: 'mypromocode2020',
    discount: 10,
    label: '10% off',
    title: 'Personal offer',
    code: 'mypromocode2020',
    validity: '6 days remaining',
    color: colors.red,
  },
  {
    id: 'summer2020',
    discount: 15,
    label: '15% off',
    title: 'Summer Sale',
    code: 'summer2020',
    validity: '23 days remaining',
    color: colors.green,
  },
  {
    id: 'personal22',
    discount: 22,
    label: '22% off',
    title: 'Personal offer',
    code: 'mypromocode2020',
    validity: '6 days remaining',
    color: colors.black,
  },
];
