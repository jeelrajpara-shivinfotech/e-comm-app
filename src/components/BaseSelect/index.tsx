import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '../../theme';
import { baseSelectStyles } from './baseSelect.styles';

interface BaseSelectProps {
  label: string;
  options: { id: number | string; label: string }[];
  selectedValue: number | string | undefined;
  onSelect: (id: number | string) => void;
  error?: string;
  containerStyle?: object;
}

const BaseSelect: React.FC<BaseSelectProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  error,
  containerStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = selectedValue !== undefined && selectedValue !== '';
  const animatedValue = useRef(new Animated.Value(hasValue ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || hasValue ? 1 : 0,
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [isFocused, hasValue]);

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
    outputRange: [colors.gray, error ? colors.red : colors.gray],
  });

  const getWrapperStyle = () => {
    return [
      baseSelectStyles.inputWrapper,
      isFocused && baseSelectStyles.focusedWrapper,
      error
        ? baseSelectStyles.errorWrapper
        : hasValue && !isFocused
        ? baseSelectStyles.successWrapper
        : null,
    ];
  };

  return (
    <View style={[baseSelectStyles.container, containerStyle]}>
      <View style={getWrapperStyle()}>
        <View style={baseSelectStyles.content}>
          <Animated.Text
            style={[
              baseSelectStyles.label,
              {
                top: labelTop,
                fontSize: labelFontSize,
                color: labelColor,
                position: 'absolute',
                left: 0,
              },
            ]}
          >
            {label}
          </Animated.Text>

          <Dropdown
            style={[
              baseSelectStyles.dropdown,
              { marginTop: hasValue || isFocused ? 14 : 0 },
            ]}
            placeholderStyle={baseSelectStyles.placeholderStyle}
            selectedTextStyle={baseSelectStyles.selectedTextStyle}
            inputSearchStyle={baseSelectStyles.inputSearchStyle}
            iconStyle={baseSelectStyles.iconStyle}
            data={options}
            search
            maxHeight={300}
            labelField="label"
            valueField="id"
            placeholder=""
            searchPlaceholder="Search..."
            value={selectedValue as any}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={item => {
              onSelect(item.id);
              setIsFocused(false);
            }}
          />
        </View>
      </View>
      {error && <Text style={baseSelectStyles.errorText}>{error}</Text>}
    </View>
  );
};

export default BaseSelect;
