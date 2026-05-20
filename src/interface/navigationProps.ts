export type AuthStackParamList = {
  RegisterScreen: undefined;
  LoginScreen: undefined;
  ForgotPasswordScreen: undefined;
};

export type BottomTabParamList = {
  HomeScreen: undefined;
  ShopScreen: undefined;
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
  };
};

export type MainStackParamList = {
  BottomTab: undefined;
};

export type RootStackParamList = {
  AuthStack: undefined;
  BottomTabs: undefined;
};
