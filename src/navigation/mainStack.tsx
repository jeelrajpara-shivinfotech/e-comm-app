import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabsNavigation from './bottomTabsNavigation';
import { MainStackParamList } from '../interface/navigationProps';

const Stack = createNativeStackNavigator<MainStackParamList>();
const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTab" component={BottomTabsNavigation} />
    </Stack.Navigator>
  );
};

export default MainStack;
