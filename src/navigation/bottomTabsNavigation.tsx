import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/homeScreen';
import { BottomTabParamList, ShopStackParamList } from '../interface/navigationProps';
import { colors } from '../theme';
import Typography from '../theme/fonts';
import HomeIcon from '../assets/svg/HomeIcon';
import ShopIcon from '../assets/svg/ShopIcon';
import BagIcon from '../assets/svg/BagIcon';
import FavIcon from '../assets/svg/FavIcon';
import UserIcon from '../assets/svg/UserIcon';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabsNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Group
        screenOptions={({ route }) => ({
          animation: 'shift',
          tabBarActiveTintColor: colors.red,
          tabBarInactiveTintColor: colors.gray,
          tabBarLabelStyle: { ...Typography.regular14 },
          tabBarShowLabel: true,
          tabBarHideOnKeyboard: false,
          tabBarStyle: {
            position: 'absolute',
            left: 20,
            right: 20,
            height: 90,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: colors.white,
            paddingBottom: 8,
            paddingTop: 10,
            elevation: 5,
            paddingHorizontal : 10
          },
          tabBarIcon: ({ focused }) => {
            const stroke = focused ? colors.red : colors.gray;
            const fill = focused ? colors.red : 'none';
            switch (route.name) {
              case 'HomeScreen':
                return <HomeIcon stroke={stroke} color={stroke} fill={fill} />;
              case 'ShopScreen':
                return <ShopIcon stroke={stroke} color={stroke} fill={fill} />;
              case 'BagScreen':
                return <BagIcon stroke={stroke} color={stroke} fill={fill} />;
              case 'FavScreen':
                return <FavIcon stroke={stroke} color={stroke} fill={fill} />;
              case 'ProfileScreen':
                return <UserIcon stroke={stroke} color={stroke} fill={fill} />;
            }
          },
        })}
      >
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ tabBarLabel: 'Home' }}
        />
      </Tab.Group>
    </Tab.Navigator>
  );
};

export default BottomTabsNavigation;
