import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  StatusBar,
} from 'react-native';
import { baseBottomDrawerStyles as styles } from './baseBottomDrawer.styles';
import { colors } from '../../theme';

export interface BottomDrawerOption<T> {
  id: T;
  label: string;
}

interface BaseBottomDrawerProps<T = any> {
  visible: boolean;
  onClose: () => void;
  title: string;
  options?: BottomDrawerOption<T>[];
  selectedValue?: T;
  onSelect?: (option: BottomDrawerOption<T>) => void;
  children?: React.ReactNode;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const BaseBottomDrawer = <T extends any>({
  visible,
  onClose,
  title,
  options = [],
  selectedValue,
  onSelect,
  children,
}: BaseBottomDrawerProps<T>) => {
  const [showModal, setShowModal] = useState(visible);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setShowModal(false);
      });
    }
  }, [visible, animatedValue]);

  const handleClose = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowModal(false);
      onClose();
    });
  };

  const handleSelect = (option: BottomDrawerOption<T>) => {
    if (onSelect) {
      onSelect(option);
    }
    handleClose();
  };

  const backdropOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });

  const sheetTranslateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, 0],
  });

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        {showModal && (
          <StatusBar
            backgroundColor={colors.black}
            barStyle="light-content"
            translucent={true}
          />
        )}
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View
            style={[
              styles.backdropTouchable,
              {
                backgroundColor: colors.black,
                opacity: backdropOpacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sheetContainer,
            {
              transform: [{ translateY: sheetTranslateY }],
            },
          ]}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>

          {children ? (
            children
          ) : (
            <ScrollView style={styles.optionsList} bounces={false}>
              {options.map(option => {
                const isSelected = option.id === selectedValue;
                return (
                  <TouchableOpacity
                    key={String(option.id)}
                    style={[
                      styles.optionRow,
                      isSelected && styles.selectedOptionRow,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => handleSelect(option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default BaseBottomDrawer;
