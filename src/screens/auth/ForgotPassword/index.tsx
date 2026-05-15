import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
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
    .required(RequiredField(forgotPasswordPageConstants.email))
    .matches(emailRegex, loginPageConstants.invalidEmail),
});

const ForgotPassword = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const handleSend = (values: ForgotPasswordValues) => {
    console.info('Forgot password email:', values.email);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      style={styles.container}
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
              label={forgotPasswordPageConstants.email}
              onChangeText={handleChange(loginPageConstants.emailSmall)}
              onBlur={handleBlur(loginPageConstants.emailSmall)}
              value={values.email}
              error={touched.email && errors.email ? errors.email : undefined}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.inputContainer}
            />

            <BaseButton
              title={forgotPasswordPageConstants.send}
              onPress={() => handleSubmit()}
              containerStyle={styles.sendButton}
              fullWidth
              size="lg"
            />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default ForgotPassword;
