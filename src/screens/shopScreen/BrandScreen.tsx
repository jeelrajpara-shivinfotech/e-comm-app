import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackIcon from '../../assets/svg/BackIcon';
import { SearchIcon } from '../../assets/svg/SearchIcon';
import { colors } from '../../theme';
import {
  brandScreenConstants,
  shopPageConstants,
  brandList,
} from '../../constants/ShopPageConstants';
import CheckIcon from '../../assets/svg/CheckIcon';
import { MainStackParamList } from '../../interface/navigationProps';
import { brandStyles as styles } from './shopScreen.styles';

const BrandScreen = () => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<MainStackParamList, 'BrandScreen'>
    >();
  const route = useRoute<RouteProp<MainStackParamList, 'BrandScreen'>>();
  const {
    selectedBrands: initialSelected,
    onApplyBrands,
    categoryId,
    categoryName,
    gender,
  } = route.params || {};

  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialSelected ?? [],
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredBrands = brandList.filter(brand =>
    brand.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand],
    );
  };

  const handleDiscard = () => {
    setSelectedBrands([]);
  };

  const handleApply = () => {
    if (onApplyBrands) {
      onApplyBrands(selectedBrands);
    }
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.white }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{brandScreenConstants.brand}</Text>
          <View style={styles.headerPlaceholder} />
        </View>
      </SafeAreaView>
      <View style={styles.searchSection}>
        <View style={styles.searchBarContainer}>
          <SearchIcon color={colors.gray} width={18} height={18} />
          <TextInput
            placeholder={brandScreenConstants.search}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor={colors.gray}
            clearButtonMode="while-editing"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.searchCloseText}>
                {shopPageConstants.closeX}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredBrands?.map(brand => {
          const isSelected = selectedBrands?.includes(brand);
          return (
            <TouchableOpacity
              key={brand}
              activeOpacity={0.8}
              onPress={() => toggleBrand(brand)}
              style={styles.brandRow}
            >
              <Text
                style={[
                  styles.brandText,
                  isSelected && styles.brandTextSelected,
                ]}
              >
                {brand}
              </Text>
              <View
                style={[styles.checkbox, isSelected && styles.checkboxSelected]}
              >
                {isSelected ? (
                  <CheckIcon
                    stroke={colors.white}
                    width={12}
                    height={12}
                    fill={'none'}
                    strokeWidth={3}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
        {filteredBrands.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {brandScreenConstants.noBrandsMatch}
            </Text>
          </View>
        )}
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={styles.bottomBarContainer}>
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.discardButton}
            activeOpacity={0.8}
            onPress={handleDiscard}
          >
            <Text style={styles.discardButtonText}>
              {brandScreenConstants.discard}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyButton}
            activeOpacity={0.8}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>
              {brandScreenConstants.apply}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default BrandScreen;
