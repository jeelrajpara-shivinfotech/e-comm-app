import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerScreenStyles as styles } from './registerScreen.styles';
import BaseTextInput from '../../../components/BaseTextInput';
import BaseButton from '../../../components/BaseButton';
import BaseSelect from '../../../components/BaseSelect';
import BaseRadio from '../../../components/BaseRadio';
import BackIcon from '../../../assets/svg/BackIcon';
import GoogleIcon from '../../../assets/svg/GoogleIcon';
import FacebookIcon from '../../../assets/svg/FacebookIcon';
import {
  emailRegex,
  passwordRegex,
  phoneNumberRegex,
} from '../../../utils/regex';
import {
  forgotPasswordPageConstants,
  loginPageConstants,
  signUpPageConstants,
} from '../../../constants/AuthPageConstants';
import { RequiredField } from '../../../utils/validationMessages';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../interface/authProps';
import { genders } from '../../../utils/enums';
import {
  getCountryListApi,
  getStateListApi,
  getCityListApi,
  signupApi,
} from '../../../api/authApi';
import { handleApiResponse } from '../../../utils/commonFunctions';

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  gender: string;
  address: {
    country_id: number | '';
    state_id: number | '';
    city_id: number | '';
    postal_code: number | '';
    label: string;
    address_line1: string;
    address_line2: string;
  };
}

interface CountryData {
  id: number;
  country_name: string;
}

interface StateData {
  id: number;
  state_name: string;
}

interface CityData {
  id: number;
  city_name: string;
}

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required(RequiredField(signUpPageConstants.name)),
  email: Yup.string()
    .required(RequiredField(loginPageConstants.email))
    .matches(emailRegex, loginPageConstants.invalidEmail),
  password: Yup.string()
    .required(RequiredField(loginPageConstants.password))
    .matches(passwordRegex, loginPageConstants.minPassword),
  phone_number: Yup.string()
    .required(RequiredField(signUpPageConstants.phoneNumber))
    .max(10, signUpPageConstants.phoneNumberMaxLength)
    .matches(phoneNumberRegex, signUpPageConstants.invalidPhoneNumber),
  gender: Yup.string().required(RequiredField(signUpPageConstants.gender)),
  address: Yup.object().shape({
    country_id: Yup.number().required(
      RequiredField(signUpPageConstants.country),
    ),
    state_id: Yup.number().required(RequiredField(signUpPageConstants.state)),
    city_id: Yup.number().required(RequiredField(signUpPageConstants.city)),
    postal_code: Yup.number()
      .typeError(signUpPageConstants.postalCodeMustBeNumber)
      .required(RequiredField(signUpPageConstants.postalCode)),
    label: Yup.string().required(
      RequiredField(signUpPageConstants.addressLable),
    ),
    address_line1: Yup.string().required(
      RequiredField(signUpPageConstants.adderessLine1),
    ),
    address_line2: Yup.string(),
  }),
});

const Register = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<{ id: number; label: string }[]>(
    [],
  );
  const [states, setStates] = useState<{ id: number; label: string }[]>([]);
  const [cities, setCities] = useState<{ id: number; label: string }[]>([]);

  useEffect(() => {
    handleApiResponse(
      getCountryListApi(),
      res => {
        if (res?.data) {
          setCountries(
            res.data.map((c: CountryData) => ({
              id: c.id,
              label: c.country_name,
            })),
          );
        }
      },
      undefined,
      false,
      false,
    );
  }, []);

  const loadStates = (countryId: number) => {
    handleApiResponse(
      getStateListApi(countryId),
      res => {
        if (res?.data) {
          setStates(
            res.data.map((s: StateData) => ({ id: s.id, label: s.state_name })),
          );
        }
      },
      undefined,
      false,
      false,
    );
  };

  const loadCities = (stateId: number) => {
    handleApiResponse(
      getCityListApi(stateId),
      res => {
        if (res?.data) {
          setCities(
            res.data.map((c: CityData) => ({ id: c.id, label: c.city_name })),
          );
        }
      },
      undefined,
      false,
      false,
    );
  };

  const handleRegister = async (values: RegisterValues) => {
    setLoading(true);
    await handleApiResponse(signupApi(values), () => {
      navigation.navigate('LoginScreen');
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
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerText}>{signUpPageConstants.signUpTitle}</Text>
        <Text style={styles.subHeaderText}>
          {signUpPageConstants.fillInDetails}
        </Text>
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            phone_number: '',
            gender: '',
            address: {
              country_id: '',
              state_id: '',
              city_id: '',
              postal_code: '',
              label: '',
              address_line1: '',
              address_line2: '',
            },
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formContainer}>
              <Text style={styles.sectionLabel}>
                {signUpPageConstants.personalInformation}
              </Text>
              <View style={styles.sectionDivider} />

              <BaseTextInput
                label={signUpPageConstants.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                error={touched.name && errors.name ? errors.name : undefined}
              />

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

              <BaseTextInput
                label={signUpPageConstants.phoneNumber}
                onChangeText={handleChange('phone_number')}
                onBlur={handleBlur('phone_number')}
                value={values.phone_number}
                error={
                  touched.phone_number && errors.phone_number
                    ? errors.phone_number
                    : undefined
                }
                keyboardType="phone-pad"
                maxLength={10}
              />

              <BaseRadio
                label={signUpPageConstants.gender}
                options={genders.map(g => ({
                  label: g,
                  value: g.toLowerCase(),
                }))}
                selectedValue={values.gender}
                onSelect={value => setFieldValue('gender', value)}
                error={
                  touched.gender && errors.gender ? errors.gender : undefined
                }
              />
              <Text style={[styles.sectionLabel, { marginTop: 16 }]}>
                {signUpPageConstants.address}
              </Text>
              <View style={styles.sectionDivider} />

              <BaseTextInput
                label={signUpPageConstants.addressLable}
                onChangeText={handleChange('address.label')}
                onBlur={handleBlur('address.label')}
                value={values.address.label}
                error={
                  touched.address?.label && errors.address?.label
                    ? errors.address.label
                    : undefined
                }
              />

              <BaseTextInput
                label={signUpPageConstants.adderessLine1}
                onChangeText={handleChange('address.address_line1')}
                onBlur={handleBlur('address.address_line1')}
                value={values.address.address_line1}
                error={
                  touched.address?.address_line1 &&
                  errors.address?.address_line1
                    ? errors.address.address_line1
                    : undefined
                }
              />

              <BaseTextInput
                label={signUpPageConstants.addressLine2}
                onChangeText={handleChange('address.address_line2')}
                onBlur={handleBlur('address.address_line2')}
                value={values.address.address_line2}
                error={
                  touched.address?.address_line2 &&
                  errors.address?.address_line2
                    ? errors.address.address_line2
                    : undefined
                }
              />

              <BaseSelect
                label={signUpPageConstants.country}
                options={countries}
                selectedValue={values.address.country_id || undefined}
                onSelect={id => {
                  setFieldValue('address.country_id', id);
                  setFieldValue('address.state_id', '');
                  setFieldValue('address.city_id', '');
                  setStates([]);
                  setCities([]);
                  loadStates(id as number);
                }}
                error={
                  touched.address?.country_id && errors.address?.country_id
                    ? errors.address.country_id
                    : undefined
                }
              />

              <BaseSelect
                label={signUpPageConstants.state}
                options={states}
                selectedValue={values.address.state_id || undefined}
                onSelect={id => {
                  setFieldValue('address.state_id', id);
                  setFieldValue('address.city_id', '');
                  setCities([]);
                  loadCities(id as number);
                }}
                error={
                  touched.address?.state_id && errors.address?.state_id
                    ? errors.address.state_id
                    : undefined
                }
              />

              <BaseSelect
                label={signUpPageConstants.city}
                options={cities}
                selectedValue={values.address.city_id || undefined}
                onSelect={id => setFieldValue('address.city_id', id)}
                error={
                  touched.address?.city_id && errors.address?.city_id
                    ? errors.address.city_id
                    : undefined
                }
              />

              <BaseTextInput
                label={signUpPageConstants.postalCode}
                onChangeText={text => {
                  const num = parseInt(text, 10);
                  setFieldValue('address.postal_code', isNaN(num) ? '' : num);
                }}
                onBlur={handleBlur('address.postal_code')}
                value={
                  values.address.postal_code
                    ? String(values.address.postal_code)
                    : ''
                }
                error={
                  touched.address?.postal_code && errors.address?.postal_code
                    ? (errors.address.postal_code as string)
                    : undefined
                }
                keyboardType="number-pad"
              />
              <BaseButton
                title={signUpPageConstants.signUpTitle.toUpperCase()}
                onPress={() => handleSubmit()}
                containerStyle={styles.signUpButton}
                fullWidth
                size="lg"
                isLoading={loading}
              />
              <TouchableOpacity
                style={styles.signInRow}
                onPress={() => navigation.navigate('LoginScreen')}
                activeOpacity={0.7}
              >
                <Text style={styles.signInText}>
                  {signUpPageConstants.alreadyHaveAccount}
                </Text>
                <Text style={styles.signInLink}>
                  {forgotPasswordPageConstants.signIn}
                </Text>
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

export default Register;
