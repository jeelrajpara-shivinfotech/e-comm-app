import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackIcon from '../../assets/svg/BackIcon';
import ArrowRight from '../../assets/svg/ArrowRight';
import { colors } from '../../theme';
import { MainStackParamList } from '../../interface/navigationProps';
import { filterScreenConstants } from '../../constants/ShopPageConstants';
import { filterStyles as styles } from './shopScreen.styles';
import { homePageConstants } from '../../constants/HomePageConstants';

const { width: screenWidth } = Dimensions.get('window');
const TRACK_PADDING = 16;
const TRACK_WIDTH = screenWidth - TRACK_PADDING * 2 - 20;

const FiltersScreen = () => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<MainStackParamList, 'FiltersScreen'>
    >();
  const route = useRoute<RouteProp<MainStackParamList, 'FiltersScreen'>>();
  const { categoryId, categoryName, gender, currentFilters } =
    route.params || {};
  const MIN_LIMIT = 0;
  const MAX_LIMIT = 200;
  const [minPrice, setMinPrice] = useState<number>(
    currentFilters?.priceRange?.[0] ?? MIN_LIMIT,
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    currentFilters?.priceRange?.[1] ?? MAX_LIMIT,
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(
    currentFilters?.colors ?? [
      filterScreenConstants.black,
      filterScreenConstants.cream,
    ],
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    currentFilters?.sizes ?? [filterScreenConstants.s, filterScreenConstants.m],
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    currentFilters?.categories ?? [filterScreenConstants.all],
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    currentFilters?.brands ?? [
      filterScreenConstants.adidasOriginals,
      filterScreenConstants.jackJones,
      filterScreenConstants.sOliver,
    ],
  );
  const leftX =
    ((minPrice - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * TRACK_WIDTH;
  const rightX =
    ((maxPrice - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * TRACK_WIDTH;

  const leftPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newX = Math.max(0, Math.min(rightX - 25, leftX + gestureState.dx));
      const percentage = newX / TRACK_WIDTH;
      const newPrice = Math.round(
        MIN_LIMIT + percentage * (MAX_LIMIT - MIN_LIMIT),
      );
      setMinPrice(newPrice);
    },
  });

  const rightPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newX = Math.max(
        leftX + 25,
        Math.min(TRACK_WIDTH, rightX + gestureState.dx),
      );
      const percentage = newX / TRACK_WIDTH;
      const newPrice = Math.round(
        MIN_LIMIT + percentage * (MAX_LIMIT - MIN_LIMIT),
      );
      setMaxPrice(newPrice);
    },
  });

  const colorItems = [
    { name: filterScreenConstants.black, hex: colors.black },
    { name: filterScreenConstants.white, hex: colors.white, hasBorder: true },
    { name: filterScreenConstants.red, hex: colors.red },
    { name: filterScreenConstants.greyPurple, hex: colors.lightPink },
    { name: filterScreenConstants.cream, hex: colors.lightYellow },
    { name: filterScreenConstants.navy, hex: colors.navyBlue },
  ];

  const sizeItems = [
    filterScreenConstants.xs,
    filterScreenConstants.s,
    filterScreenConstants.m,
    filterScreenConstants.l,
    filterScreenConstants.xl,
  ];

  const categoryItems = [
    filterScreenConstants.all,
    filterScreenConstants.women,
    filterScreenConstants.men,
    filterScreenConstants.boys,
    filterScreenConstants.girls,
  ];

  const toggleColor = (colorName: string) => {
    setSelectedColors(prev =>
      prev.includes(colorName)
        ? prev.filter(c => c !== colorName)
        : [...prev, colorName],
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size],
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category],
    );
  };

  const handleDiscard = () => {
    setMinPrice(MIN_LIMIT);
    setMaxPrice(MAX_LIMIT);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedCategories([]);
    setSelectedBrands([]);
  };

  const handleApply = () => {
    navigation.navigate('BottomTab', {
      screen: 'ShopScreen',
      params: {
        screen: 'CategoryProducts',
        params: {
          categoryId,
          categoryName,
          gender,
          appliedFilters: undefined,
        },
      },
    });
  };

  const handleNavigateToBrandSelection = () => {
    navigation.navigate('BrandScreen', {
      selectedBrands,
      onApplyBrands: (brands: string[]) => {
        setSelectedBrands(brands);
      },
      categoryId,
      categoryName,
      gender,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.white }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {filterScreenConstants.filters}
          </Text>
          <View style={styles.headerPlaceholder} />
        </View>
      </SafeAreaView>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {filterScreenConstants.priceRange}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <View style={styles.priceTextContainer}>
            <Text style={styles.priceText}>{homePageConstants.dollarSign}{minPrice}</Text>
            <Text style={styles.priceText}>{homePageConstants.dollarSign}{maxPrice}</Text>
          </View>
          <View style={styles.sliderTrackContainer}>
            <View style={styles.sliderBaseTrack} />
            <View
              style={[
                styles.sliderHighlightTrack,
                {
                  left: leftX + 10,
                  width: rightX - leftX,
                },
              ]}
            />
            <View
              {...leftPanResponder.panHandlers}
              style={[
                styles.sliderThumb,
                {
                  transform: [{ translateX: leftX }],
                },
              ]}
            />
            <View
              {...rightPanResponder.panHandlers}
              style={[
                styles.sliderThumb,
                {
                  transform: [{ translateX: rightX }],
                },
              ]}
            />
          </View>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {filterScreenConstants.colors}
          </Text>
        </View>
        <View style={styles.colorsContainer}>
          {colorItems.map(color => {
            const isSelected = selectedColors?.includes(color.name);
            return (
              <TouchableOpacity
                key={color.name}
                activeOpacity={0.8}
                onPress={() => toggleColor(color.name)}
                style={[
                  styles.colorOutlineContainer,
                  isSelected && styles.colorOutlineSelected,
                ]}
              >
                <View
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color.hex },
                    color.hasBorder && styles.colorCircleBorder,
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{filterScreenConstants.sizes}</Text>
        </View>
        <View style={styles.sizesContainer}>
          {sizeItems?.map(size => {
            const isSelected = selectedSizes?.includes(size);
            return (
              <TouchableOpacity
                key={size}
                activeOpacity={0.8}
                onPress={() => toggleSize(size)}
                style={[
                  styles.sizeButton,
                  isSelected && styles.sizeButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.sizeText,
                    isSelected && styles.sizeTextSelected,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {filterScreenConstants.category}
          </Text>
        </View>
        <View style={styles.categoryContainer}>
          {categoryItems.map(category => {
            const isSelected = selectedCategories?.includes(category);
            return (
              <TouchableOpacity
                key={category}
                activeOpacity={0.8}
                onPress={() => toggleCategory(category)}
                style={[
                  styles.categoryButton,
                  isSelected && styles.categoryButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          style={styles.brandRow}
          activeOpacity={0.7}
          onPress={handleNavigateToBrandSelection}
        >
          <View style={styles.brandLeft}>
            <Text style={styles.brandLabel}>{filterScreenConstants.brand}</Text>
            <Text
              style={styles.brandValues}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {selectedBrands?.length > 0
                ? selectedBrands.join(', ')
                : filterScreenConstants.all}
            </Text>
          </View>
          <ArrowRight width={20} height={20} color={colors.black} />
        </TouchableOpacity>
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={styles.bottomBarContainer}>
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.discardButton}
            activeOpacity={0.8}
            onPress={handleDiscard}
          >
            <Text style={styles.discardButtonText}>
              {filterScreenConstants.discard}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyButton}
            activeOpacity={0.8}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>
              {filterScreenConstants.apply}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default FiltersScreen;
