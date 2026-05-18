import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { loginScreenStyles as styles } from './loginScreen.styles';
import BaseTextInput from '../../../components/BaseTextInput';
import BaseButton from '../../../components/BaseButton';
import GoogleIcon from '../../../assets/svg/GoogleIcon';
import FacebookIcon from '../../../assets/svg/FacebookIcon';
import { emailRegex } from '../../../utils/regex';
import { loginPageConstants } from '../../../constants/AuthPageConstants';
import { RequiredField } from '../../../utils/validationMessages';
import { useNavigation } from '@react-navigation/native';
import BackIcon from '../../../assets/svg/BackIcon';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../interface/authProps';
import { loginApi } from '../../../api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleApiResponse } from '../../../utils/commonFunctions';

interface LoginValues {
  email: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .required(RequiredField(loginPageConstants.email))
    .matches(emailRegex, loginPageConstants.invalidEmail),
  password: Yup.string().required(RequiredField(loginPageConstants.password)),
});
const Login = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: LoginValues) => {
    setLoading(true);
    const apiCall = loginApi({
      email: values.email,
      password: values.password,
    });

    await handleApiResponse(apiCall, response => {
      if (response?.data?.token) {
        AsyncStorage.setItem('authToken', response.data.token);
      }
    });

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerText}>{loginPageConstants.loginTitle}</Text>
        <Text style={styles.subHeaderText}>
          {loginPageConstants.welcomeBack}
        </Text>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formContainer}>
              <BaseTextInput
                label={loginPageConstants.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                error={touched.email && errors.email ? errors.email : undefined}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <BaseTextInput
                label={loginPageConstants.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                error={
                  touched.password && errors.password
                    ? errors.password
                    : undefined
                }
                secureTextEntry
              />
              <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={() => navigation.navigate('ForgotPasswordScreen')}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>
                  {loginPageConstants.forgotPassword}
                </Text>
              </TouchableOpacity>
              <BaseButton
                title={loginPageConstants.loginTitle}
                onPress={() => handleSubmit()}
                containerStyle={styles.loginButton}
                fullWidth
                size="lg"
                isLoading={loading}
              />
              <TouchableOpacity
                style={styles.signUpRow}
                onPress={() => navigation.navigate('RegisterScreen')}
                activeOpacity={0.7}
              >
                <Text style={styles.signUpText}>
                  {loginPageConstants.noAccount}
                </Text>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>{loginPageConstants.orContinueWith}</Text>
          <View style={styles.orLine} />
        </View>
        <View style={styles.socialContainer}>
          <View style={styles.socialButtonsRow}>
            <TouchableOpacity style={styles.socialButton}>
              <GoogleIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FacebookIcon />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
