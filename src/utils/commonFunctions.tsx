import React, { useState, useEffect } from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';
import { StatusCodes } from 'http-status-codes';
import Toast from 'react-native-toast-message';
import { ToastMessageType } from './enums';
import fallbackimage from '../assets/images/fall_back_image1.png';

export const checkStatusCodeSuccess = (data: StatusCodes) => {
  if (
    data === StatusCodes.OK ||
    data === StatusCodes.ACCEPTED ||
    data === StatusCodes.CREATED
  ) {
    return true;
  } else {
    return false;
  }
};

export const handleApiResponse = async (
  apiCall: Promise<any>,
  onSuccess?: (data: any) => void,
  onSuccessApiCall?: () => Promise<any>,
  showSuccessToast = true,
  showErrorToast = true,
  onFailure?: (errorMessage?: string, errorData?: any) => void,
) => {
  try {
    const response = await apiCall;
    if (checkStatusCodeSuccess(response?.statusCode)) {
      if (showSuccessToast) {
        Toast.show({
          type: ToastMessageType.success,
          text1: ToastMessageType.textSuccess,
          text2: response?.message,
        });
      }

      if (onSuccess) {
        onSuccess(response);
      }

      if (onSuccessApiCall) {
        await onSuccessApiCall();
      }
    } else {
      onFailure?.(response?.message || response);
      if (showErrorToast) {
        Toast.show({
          type: ToastMessageType.error,
          text1: ToastMessageType.textError,
          text2: response?.message,
        });
      }
    }

    return response;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ?? ToastMessageType.somethingWentWrong;
    const errorData = error?.response?.data;
    onFailure?.(errorMessage, errorData);
    if (showErrorToast) {
      Toast.show({
        type: ToastMessageType.error,
        text1: ToastMessageType.textError,
        text2: errorMessage,
      });
    }
    return error;
  }
};

export interface SafeImageProps {
  uri: string;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  fallbackUri?: ImageSourcePropType;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  uri,
  style,
  resizeMode = 'cover',
  fallbackUri = fallbackimage,
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [uri]);

  return (
    <Image
      source={
        imageError
          ? fallbackUri
          : { uri }
      }
      style={style}
      resizeMode={resizeMode}
      onError={() => {
        setImageError(true);
      }}
    />
  );
};
