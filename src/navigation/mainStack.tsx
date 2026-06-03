import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabsNavigation from './bottomTabsNavigation';
import FiltersScreen from '../screens/shopScreen/FiltersScreen';
import BrandScreen from '../screens/shopScreen/BrandScreen';
import ProductScreen from '../screens/productScreen';
import { navigationRoutes } from '../constants/ShopPageConstants';
import { MainStackParamList } from '../interface/navigationProps';

const Stack = createNativeStackNavigator<MainStackParamList>();
const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTab" component={BottomTabsNavigation} />
      <Stack.Screen name="FiltersScreen" component={FiltersScreen} />
      <Stack.Screen name="BrandScreen" component={BrandScreen} />
      <Stack.Screen name={navigationRoutes.productCardScreen} component={ProductScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
