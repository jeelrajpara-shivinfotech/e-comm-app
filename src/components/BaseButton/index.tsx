import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { baseButtonStyles as styles } from './baseButton.styles';
import { colors } from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface BaseButtonProps extends TouchableOpacityProps {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

const BaseButton: React.FC<BaseButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  containerStyle,
  textStyle,
  children,
  activeOpacity = 0.7,
  ...props
}) => {
  const isButtonDisabled = disabled || isLoading;

  const getContainerStyles = () => {
    return [
      styles.container,
      styles[variant],
      styles[size],
      fullWidth && styles.fullWidth,
      isButtonDisabled && styles.disabled,
      containerStyle,
    ];
  };

  const getTextStyle = () => {
    const textVariantStyle = `text${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof styles;
    const textSizeStyle = `text${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles;
    
    return [
      styles.text,
      styles[textVariantStyle] as TextStyle,
      styles[textSizeStyle] as TextStyle,
      textStyle,
    ];
  };

  const renderContent = () => {
    return (
      <View style={[styles.content, isLoading && styles.hiddenContent]}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        {title ? (
          <Text style={getTextStyle()}>{title}</Text>
        ) : (
          children
        )}
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
    );
  };

  const loaderColor = variant === 'outline' || variant === 'ghost' ? colors.red : colors.white;

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      disabled={isButtonDisabled}
      style={getContainerStyles()}
      {...props}
    >
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={loaderColor} size="small" />
        </View>
      )}
      {renderContent()}
    </TouchableOpacity>
  );
};

export default BaseButton;