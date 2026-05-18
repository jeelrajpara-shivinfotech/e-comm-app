import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { forgotPasswordScreenStyles as styles } from './forgotPasswordScreen.styles';
import BaseTextInput from '../../../components/BaseTextInput';
import BaseButton from '../../../components/BaseButton';
import BackIcon from '../../../assets/svg/BackIcon';
import { emailRegex } from '../../../utils/regex';
import {
  forgotPasswordPageConstants,
  loginPageConstants,
} from '../../../constants/AuthPageConstants';
import { RequiredField } from '../../../utils/validationMessages';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../interface/authProps';

interface ForgotPasswordValues {
  email: string;
}

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .required(RequiredField(loginPageConstants.email))
    .matches(emailRegex, loginPageConstants.invalidEmail),
});

const ForgotPassword = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const handleSend = (values: ForgotPasswordValues) => {
    console.info('Forgot password email:', values.email);
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
      <Text style={styles.headerText}>
        {forgotPasswordPageConstants.forgotPasswordTitle}
      </Text>
      <Text style={styles.descriptionText}>
        {forgotPasswordPageConstants.forgotPasswordDescription}
      </Text>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={handleSend}
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
            />

            <BaseButton
              title={forgotPasswordPageConstants.send}
              onPress={() => handleSubmit()}
              containerStyle={styles.sendButton}
              fullWidth
              size="lg"
            />
            <TouchableOpacity
              style={styles.backToLoginRow}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.backToLoginText}>
                {forgotPasswordPageConstants.rememberPassword}
              </Text>
              <Text style={styles.backToLoginLink}>
                {forgotPasswordPageConstants.signIn}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
