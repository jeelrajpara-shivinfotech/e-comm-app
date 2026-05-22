import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  RegisterScreen: undefined;
  LoginScreen: undefined;
  ForgotPasswordScreen: undefined;
};

export type BottomTabParamList = {
  HomeScreen: undefined;
  ShopScreen: NavigatorScreenParams<ShopStackParamList>;
  BagScreen: undefined;
  FavScreen: undefined;
  ProfileScreen: undefined;
};

export type ShopStackParamList = {
  ShopIndex: undefined;
  CategoryProducts: {
    categoryId: number;
    categoryName: string;
    gender: string;
    appliedFilters?: {
      priceRange?: [number, number];
      colors?: string[];
      sizes?: string[];
      categories?: string[];
      brands?: string[];
    };
  };
};

export type MainStackParamList = {
  BottomTab: NavigatorScreenParams<BottomTabParamList>;
  FiltersScreen: {
    categoryId: number;
    categoryName: string;
    gender: string;
    currentFilters?: {
      priceRange: [number, number];
      colors: string[];
      sizes: string[];
      categories: string[];
      brands: string[];
    };
  };
  BrandScreen: {
    selectedBrands: string[];
    onApplyBrands: (brands: string[]) => void;
    categoryId: number;
    categoryName: string;
    gender: string;
  };
};

export type RootStackParamList = {
  AuthStack: undefined;
  BottomTabs: undefined;
};
