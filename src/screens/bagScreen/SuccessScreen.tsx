import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme';
import BaseButton from '../../components/BaseButton';
import { MainStackParamList } from '../../interface/navigationProps';
import { bagPageConstants } from '../../constants/BagPageConstants';
import { SuccessIllustration } from '../../assets/svg/SuccessIllustration';
import { successScreenStyles } from './bagScreen.styles';

const SuccessScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handleContinueShopping = () => {
    navigation.navigate(bagPageConstants.bottomTabRoute, {
      screen: bagPageConstants.homeScreenRoute,
    });
  };

  return (
    <SafeAreaView style={successScreenStyles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={successScreenStyles.contentContainer}>
        <View style={successScreenStyles.illustrationContainer}>
          <SuccessIllustration />
        </View>
        <Text style={successScreenStyles.title}>{bagPageConstants.successTitle}</Text>
        <Text style={successScreenStyles.subtext}>{bagPageConstants.successSubtext}</Text>
      </View>
      <BaseButton
        title={bagPageConstants.continueShoppingBtn}
        variant="primary"
        fullWidth
        containerStyle={successScreenStyles.continueButton}
        onPress={handleContinueShopping}
      />
    </SafeAreaView>
  );
};

export default SuccessScreen;
