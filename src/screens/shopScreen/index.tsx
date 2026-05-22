import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme';
import { shopStyles as styles } from './shopScreen.styles';
import { getCategoryListApi } from '../../api/categoryApi';
import { handleApiResponse } from '../../utils/commonFunctions';
import {
  Category,
  CategoryResponse,
} from '../../interceptors/CategoryInterface';
import { BASE_IMAGE_URL } from '@env';
import BackIcon from '../../assets/svg/BackIcon';
import { SearchIcon } from '../../assets/svg/SearchIcon';
import { shopPageConstants } from '../../constants/ShopPageConstants';

const ShopScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [activeTab, setActiveTab] = useState<'Women' | 'Men' | 'Kids'>('Women');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    fetchCategories(searchQuery);
  }, []);

  const fetchCategories = async (query = searchQuery) => {
    setLoading(true);
    const payload = {
      page: 1,
      pageSize: 1000,
      sortKey: 'id',
      sortValue: 'asc',
      search: query,
    };
    const apiCall = getCategoryListApi(payload);
    await handleApiResponse(
      apiCall,
      (response: CategoryResponse) => {
        if (
          response &&
          response.data &&
          Array.isArray(response.data.categories)
        ) {
          setCategories(response.data.categories);
        }
      },
      undefined,
      false,
      true,
    );
    setLoading(false);
  };

  const tabs: ('Women' | 'Men' | 'Kids')[] = ['Women', 'Men', 'Kids'];

  const renderCategoryItem = ({ item }: { item: Category }) => {
    const imagePath = item.category_image;
    let fallbackUrl =
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400';
    const imageUrl = imagePath ? `${BASE_IMAGE_URL}/${imagePath}` : fallbackUrl;

    return (
      <TouchableOpacity
        style={styles.categoryCard}
        activeOpacity={0.85}
        onPress={() => {
          navigation.navigate('CategoryProducts', {
            categoryId: item?.id,
            categoryName: item?.category_name,
            gender: activeTab,
          });
        }}
      >
        <View style={styles.categoryTextContainer}>
          <Text style={styles.categoryTitle}>{item?.category_name}</Text>
        </View>
        <Image
          source={{ uri: imageUrl }}
          style={styles.categoryImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={styles.header}>
        {!isSearchActive ? (
          <>
            <TouchableOpacity
              style={styles.headerLeft}
              onPress={() => navigation.goBack()}
            >
              <BackIcon />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{shopPageConstants.category}</Text>
            <TouchableOpacity
              style={styles.headerRight}
              onPress={() => setIsSearchActive(true)}
            >
              <SearchIcon />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.headerLeft}
              onPress={() => {
                setIsSearchActive(false);
                setSearchQuery('');
                fetchCategories('');
              }}
            >
              <BackIcon />
            </TouchableOpacity>
            <View style={styles.searchBarContainer}>
              <TextInput
                autoFocus
                placeholder={shopPageConstants.noCategoryFound}
                value={searchQuery}
                onChangeText={text => setSearchQuery(text)}
                onSubmitEditing={() => fetchCategories(searchQuery)}
                style={styles.searchInput}
                placeholderTextColor={colors.gray}
                returnKeyType="search"
              />
              {searchQuery ? (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                    fetchCategories('');
                  }}
                >
                  <Text style={styles.searchCloseText}>
                    {shopPageConstants.closeX}
                  </Text>
                </TouchableOpacity>
              ) : (
                <SearchIcon color={colors.black} />
              )}
            </View>
          </>
        )}
      </View>
      <View style={styles.tabBar}>
        {tabs?.map(tab => (
          <TouchableOpacity
            key={tab}
            style={styles.tabButton}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id?.toString()}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchCategories}
        refreshing={loading}
        ListHeaderComponent={
          <View style={styles.bannerContainer}>
            <Text style={styles.bannerTitle}>
              {shopPageConstants.summerSale}
            </Text>
            <Text style={styles.bannerSubtitle}>{shopPageConstants.upTo}</Text>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={colors.red} />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {shopPageConstants.noCategoryFound}
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default ShopScreen;
