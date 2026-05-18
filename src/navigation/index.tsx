import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/auth/Login/index';
import RegisterScreen from '../screens/auth/Register/index';
import ForgotPasswordScreen from '../screens/auth/ForgotPassword/index';
import { AuthStackParamList } from '../interface/authProps';
import MainStack from './mainStack';

const Navigation = () => {
  const Stack = createNativeStackNavigator<AuthStackParamList>();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: 'slide_from_left' }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        <Stack.Screen name="Main" component={MainStack}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
