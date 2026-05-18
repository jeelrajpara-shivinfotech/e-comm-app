import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerScreenStyles as styles } from './registerScreen.styles';
import BaseTextInput from '../../../components/BaseTextInput';
import BaseButton from '../../../components/BaseButton';
import BackIcon from '../../../assets/svg/BackIcon';
import ArrowRight from '../../../assets/svg/ArrowRight';
import GoogleIcon from '../../../assets/svg/GoogleIcon';
import FacebookIcon from '../../../assets/svg/FacebookIcon';
import { colors } from '../../../theme';
import { emailRegex, passwordRegex } from '../../../utils/regex';
import {
  loginPageConstants,
  signUpPageConstants,
} from '../../../constants/AuthPageConstants';
import { RequiredField } from '../../../utils/validationMessages';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../interface/authProps';

interface RegisterValues {
  name: string;
  email: string;
  password: string;
}

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required(RequiredField(signUpPageConstants.name)),
  email: Yup.string()
    .required(RequiredField(loginPageConstants.email))
    .matches(emailRegex, loginPageConstants.invalidEmail),
  password: Yup.string()
    .required(RequiredField(loginPageConstants.password))
    .matches(passwordRegex, loginPageConstants.minPassword),
});

const Register = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const handleRegister = (values: RegisterValues) => {
    console.info('Register values:', values);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      style={styles.container}
    >
      <Text style={styles.headerText}>{signUpPageConstants.signUpTitle}</Text>
      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
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
              label={signUpPageConstants.name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              error={touched.name && errors.name ? errors.name : undefined}
              containerStyle={styles.inputContainer}
            />

            <BaseTextInput
              label={loginPageConstants.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              error={touched.email && errors.email ? errors.email : undefined}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.inputContainer}
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
              containerStyle={styles.inputContainer}
            />

            <TouchableOpacity
              style={styles.alreadyHaveAccountContainer}
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={styles.alreadyHaveAccountText}>
                {signUpPageConstants.alreadyHaveAccount}
              </Text>
              <ArrowRight stroke={colors.dangerRed} />
            </TouchableOpacity>

            <BaseButton
              title={signUpPageConstants.signUpTitle.toUpperCase()}
              onPress={() => handleSubmit()}
              containerStyle={styles.signUpButton}
              fullWidth
              size="lg"
            />
          </View>
        )}
      </Formik>

      <View style={styles.socialContainer}>
        <Text style={styles.socialText}>
          {signUpPageConstants.signUpDescription}
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

export default Register;
