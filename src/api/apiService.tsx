import {BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const baseURL: string = BASE_URL;

export const nonAuthServices = axios.create({
  baseURL,
});

export const authServices = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: 'application/json',
  },
});

export const formDataServices = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: 'multipart/form-data',
  },
});

authServices.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

formDataServices.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);