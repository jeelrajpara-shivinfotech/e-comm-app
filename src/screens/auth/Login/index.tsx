import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { loginScreenStyles as styles } from './loginScreen.styles';
import BaseTextInput from '../../../components/BaseTextInput';
import BaseButton from '../../../components/BaseButton';
import ArrowRight from '../../../assets/svg/ArrowRight';
import GoogleIcon from '../../../assets/svg/GoogleIcon';
import FacebookIcon from '../../../assets/svg/FacebookIcon';
import { colors } from '../../../theme';
import { emailRegex } from '../../../utils/regex';
import { loginPageConstants } from '../../../constants/AuthPageConstants';
import { RequiredField } from '../../../utils/validationMessages';
import { useNavigation } from '@react-navigation/native';
import BackIcon from '../../../assets/svg/BackIcon';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../interface/authProps';

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
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const handleLogin = (values: LoginValues) => {
    console.info('Login values:', values);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      style={styles.container}
    >
      <BaseButton
        leftIcon={<BackIcon />}
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      />
      <Text style={styles.headerText}>{loginPageConstants.loginTitle}</Text>

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
              onChangeText={handleChange(loginPageConstants.email.toLowerCase())}
              onBlur={handleBlur(loginPageConstants.email.toLowerCase())}
              value={values.email}
              error={touched.email && errors.email ? errors.email : undefined}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.inputContainer}
            />

            <BaseTextInput
              label={loginPageConstants.password}
              onChangeText={handleChange(loginPageConstants.password.toLowerCase())}
              onBlur={handleBlur(loginPageConstants.password.toLowerCase())}
              value={values.password}
              error={
                touched.password && errors.password
                  ? errors.password
                  : undefined
              }
              secureTextEntry
              containerStyle={styles.inputContainer}
            />

            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={() => navigation.navigate('ForgotPasswordScreen')}
            >
              <Text style={styles.forgotPasswordText}>
                {loginPageConstants.forgotPassword}
              </Text>
              <ArrowRight stroke={colors.dangerRed} />
            </TouchableOpacity>

            <BaseButton
              title={loginPageConstants.loginTitle}
              onPress={() => handleSubmit()}
              containerStyle={styles.loginButton}
              fullWidth
              size="lg"
            />
          </View>
        )}
      </Formik>

      <View style={styles.socialContainer}>
        <Text style={styles.socialText}>
          {loginPageConstants.loginDescription}
        </Text>
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
  );
};

export default Login;
