import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { baseRadioStyles } from './baseRadio.styles';

interface BaseRadioProps {
  label: string;
  options: { label: string; value: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
  error?: string;
  containerStyle?: object;
}

const BaseRadio: React.FC<BaseRadioProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  error,
  containerStyle,
}) => {
  return (
    <View style={[baseRadioStyles.container, containerStyle]}>
      <Text style={baseRadioStyles.label}>{label}</Text>
      <View style={baseRadioStyles.radioGroup}>
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={baseRadioStyles.radioButtonContainer}
            onPress={() => onSelect(option.value)}
          >
            <View style={baseRadioStyles.outerCircle}>
              {selectedValue === option.value && (
                <View style={baseRadioStyles.innerCircle} />
              )}
            </View>
            <Text style={baseRadioStyles.radioLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={baseRadioStyles.errorText}>{error}</Text>}
    </View>
  );
};



export default BaseRadio;
