import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabsNavigation from './bottomTabsNavigation';
import FiltersScreen from '../screens/shopScreen/FiltersScreen';
import BrandScreen from '../screens/shopScreen/BrandScreen';
import ProductScreen from '../screens/productScreen';
import { navigationRoutes } from '../constants/ShopPageConstants';
import { bagPageConstants } from '../constants/BagPageConstants';
import { MainStackParamList } from '../interface/navigationProps';
import PaymentMethodsScreen from '../screens/bagScreen/PaymentMethodsScreen';
import SuccessScreen from '../screens/bagScreen/SuccessScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();
const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={bagPageConstants.bottomTabRoute} component={BottomTabsNavigation} />
      <Stack.Screen name={navigationRoutes.filtersScreen} component={FiltersScreen} />
      <Stack.Screen name={navigationRoutes.brandScreen} component={BrandScreen} />
      <Stack.Screen name={navigationRoutes.productCardScreen} component={ProductScreen} />
      <Stack.Screen name={bagPageConstants.paymentMethodsScreenRoute} component={PaymentMethodsScreen} />
      <Stack.Screen name={bagPageConstants.successScreenRoute} component={SuccessScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
