import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  Animated,
  Easing,
} from 'react-native';
import { baseTextInputStyles as styles } from './baseTextInput.styles';
import { colors } from '../../theme';
import RightIcon from '../../assets/svg/RightIcon';

interface BaseTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputWrapperStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
}

const BaseTextInput: React.FC<BaseTextInputProps> = ({
  label,
  error,
  containerStyle,
  inputWrapperStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  onFocus,
  onBlur,
  secureTextEntry,
  value,
  defaultValue,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [textValue, setTextValue] = useState(value || defaultValue || '');
  const animatedValue = useRef(new Animated.Value(textValue ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: (isFocused || textValue) ? 1 : 0,
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [isFocused, textValue]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus && onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  const handleChangeText = (text: string) => {
    setTextValue(text);
    props.onChangeText && props.onChangeText(text);
  };

  const getWrapperStyle = () => {
    return [
      styles.inputWrapper,
      isFocused && styles.focusedWrapper,
      error ? styles.errorWrapper : (textValue && !isFocused ? styles.successWrapper : null),
      inputWrapperStyle,
    ];
  };

  const labelTop = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [22, 8],
  });

  const labelFontSize = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 11],
  });

  const labelColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#9B9B9B', error ? colors.red : '#9B9B9B'],
  });

  const renderRightIcon = () => {
    if (error) {
      return (
        <View style={styles.iconRight}>
          <RightIcon/>
        </View>
      );
    }
    if (textValue && !error) {
      return (
        <View style={styles.iconRight}>
          <RightIcon/>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={getWrapperStyle()}>
        <View style={styles.content}>
          <Animated.Text
            style={[
              styles.label,
              {
                top: labelTop,
                fontSize: labelFontSize,
                color: labelColor,
                position: 'absolute',
                left: 0,
              },
              labelStyle,
            ]}
          >
            {label}
          </Animated.Text>
          <TextInput
            style={[
              styles.input,
              {
                marginTop: textValue || isFocused ? 14 : 0,
                height: 24,
              },
              inputStyle,
            ]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            secureTextEntry={secureTextEntry}
            value={textValue}
            {...props}
          />
        </View>
        {renderRightIcon()}
      </View>
      
      {error && (
        <Text style={[styles.errorText, errorStyle]}>{error}</Text>
      )}
    </View>
  );
};

export default BaseTextInput;
