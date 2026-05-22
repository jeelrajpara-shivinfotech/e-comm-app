import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme';
import { shopStyles as styles } from './shopScreen.styles';
import { getCategoryProductsApi } from '../../api/categoryApi';
import { handleApiResponse } from '../../utils/commonFunctions';
import {
  CategoryProductsResponse,
  CategoryProduct,
} from '../../interceptors/CategoryInterface';
import { BASE_IMAGE_URL } from '@env';
import BackIcon from '../../assets/svg/BackIcon';
import FavIcon from '../../assets/svg/FavIcon';
import { SearchIcon } from '../../assets/svg/SearchIcon';
import { FilterIcon } from '../../assets/svg/FilterIcon';
import { GridIcon } from '../../assets/svg/GridIcon';
import { SortIcon } from '../../assets/svg/SortIcon';
import { ListIcon } from '../../assets/svg/ListIcon';
import { StarIcon } from '../../assets/svg/StarIcon';
import {
  categoryProducts,
  shopPageConstants,
} from '../../constants/ShopPageConstants';
import { homePageConstants } from '../../constants/HomePageConstants';

const CategoryProducts = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { categoryId, categoryName, gender } = route.params || {
    categoryId: 0,
    categoryName: 'Tops',
    gender: 'Women',
  };

  const [products, setProducts] = useState<CategoryProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<CategoryProduct[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  const [activeTag, setActiveTag] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<string>('price_asc');
  const [isSortDrawerVisible, setIsSortDrawerVisible] =
    useState<boolean>(false);
  const [favoriteProductIds, setFavoriteProductIds] = useState<Set<number>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const subcategoryTags = [
    categoryProducts.all,
    categoryProducts.tShirt,
    categoryProducts.cropTops,
    categoryProducts.sleevLess,
    categoryProducts.shirts,
    categoryProducts.blouses,
  ];

  const sortOptions = [
    { id: 'popular', label: categoryProducts.popular },
    { id: 'newest', label: categoryProducts.newest },
    { id: 'customer_review', label: categoryProducts.customerReview },
    { id: 'price_asc', label: categoryProducts.priceLow },
    { id: 'price_desc', label: categoryProducts.priceHigh },
  ];

  useEffect(() => {
    fetchProducts(searchQuery);
  }, [selectedSort]);

  const fetchProducts = async (query = searchQuery) => {
    setLoading(true);
    let sortKey = 'price';
    let sortValue = 'asc';

    if (selectedSort === 'price_asc') {
      sortKey = 'id';
      sortValue = 'asc';
    } else if (selectedSort === 'price_desc') {
      sortKey = 'id';
      sortValue = 'desc';
    } else if (selectedSort === 'newest') {
      sortKey = 'id';
      sortValue = 'asc';
    } else if (selectedSort === 'popular') {
      sortKey = 'id';
      sortValue = 'desc';
    } else if (selectedSort === 'customer_review') {
      sortKey = 'id';
      sortValue = 'asc';
    }

    const payload = {
      category_id: categoryId,
      page: 1,
      pageSize: 30,
      sortKey,
      sortValue,
      search: query,
    };

    const apiCall = getCategoryProductsApi(payload);
    console.log(payload);
    await handleApiResponse(
      apiCall,
      (response: CategoryProductsResponse) => {
        response && response.data && Array.isArray(response.data.categories);
        const category =
          response.data.categories.find(c => c.id === categoryId) ||
          response.data.categories[0];
        const fetchedProducts = category?.products || [];
        setProducts(fetchedProducts);
        applyFilters(activeTag, fetchedProducts, route.params?.appliedFilters);
      },
      undefined,
      false,
      true,
    );
    setLoading(false);
  };

  const applyFilters = (
    tag: string = activeTag,
    currentProducts: CategoryProduct[] = products,
    filters = route.params?.appliedFilters,
  ) => {
    setActiveTag(tag);
    let result = [...currentProducts];
    if (tag !== 'All') {
      result = result.filter(
        product =>
          product.name
            ?.toLowerCase()
            .includes(tag.toLowerCase().replace('-', '')) ||
          product.variants?.[0]?.product_title_name
            ?.toLowerCase()
            .includes(tag.toLowerCase().replace('-', '')),
      );
    }
    if (filters) {
      if (filters.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange;
        result = result.filter(product => {
          const priceStr = product.variants?.[0]?.price;
          const price = priceStr;
          return price >= minPrice && price <= maxPrice;
        });
      }
      if (filters.brands && filters.brands.length > 0) {
        result = result.filter(product => {
          const brandName = product.name;
          return filters.brands.some((brand: string) =>
            brandName.toLowerCase().includes(brand.toLowerCase()),
          );
        });
      }
    }
    setFilteredProducts(result);
  };

  useEffect(() => {
    applyFilters(activeTag, products, route.params?.appliedFilters);
  }, [route.params?.appliedFilters, products]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<StarIcon key={i} filled={i <= rating} />);
    }
    return <View style={styles.starsRow}>{stars}</View>;
  };

  const renderProductItem = ({
    item,
    index,
  }: {
    item: CategoryProduct;
    index: number;
  }) => {
    const variant = item.variants?.[0];
    const imagePath = variant?.image?.image_path;
    const imageUrl = imagePath
      ? imagePath.startsWith('http://') || imagePath.startsWith('https://')
        ? imagePath
        : `${BASE_IMAGE_URL}/${imagePath}`
      : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300';
    const isFavorite = favoriteProductIds.has(item.id);
    const rating = (index % 3) + 3;
    const ratingCount = index * 4 + 3;

    if (isGridView) {
      return (
        <TouchableOpacity style={styles.gridProductCard} activeOpacity={0.9}>
          <View style={styles.gridProductImageContainer}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.gridProductImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.gridProductInfo}>
            <Text style={styles.gridProductBrand} numberOfLines={1}>
              {item?.name}
            </Text>
            <Text style={styles.gridProductName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.ratingContainer}>
              {renderStars(rating)}
              <Text style={styles.ratingCount}>({ratingCount})</Text>
            </View>
            <Text
              style={styles.gridProductPrice}
            >{`${variant.price}${homePageConstants.dollarSign}`}</Text>
          </View>
          <TouchableOpacity
            style={styles.gridFavoriteButton}
            activeOpacity={0.8}
          >
            <FavIcon
              width={18}
              height={18}
              color={isFavorite ? colors.dangerRed : colors.gray}
              fill={isFavorite ? colors.dangerRed : 'none'}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.listProductCard} activeOpacity={0.9}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.listProductImage}
          resizeMode="cover"
        />
        <View style={styles.listProductInfo}>
          <View>
            <Text style={styles.listProductBrand} numberOfLines={1}>
              {item?.name}
            </Text>
            <Text style={styles.listProductName} numberOfLines={1}>
              {item?.name}
            </Text>
            <View style={styles.ratingContainer}>
              {renderStars(rating)}
              <Text style={styles.ratingCount}>({ratingCount})</Text>
            </View>
          </View>
          <Text
            style={styles.listProductPrice}
          >{`${variant?.price}${homePageConstants.dollarSign}`}</Text>
        </View>
        <TouchableOpacity style={styles.favoriteButton} activeOpacity={0.8}>
          <FavIcon
            width={18}
            height={18}
            color={isFavorite ? colors.dangerRed : colors.gray}
            fill={isFavorite ? colors.dangerRed : 'none'}
          />
        </TouchableOpacity>
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
                fetchProducts('');
              }}
            >
              <BackIcon />
            </TouchableOpacity>
            <View style={styles.searchBarContainer}>
              <TextInput
                autoFocus
                placeholder={categoryProducts.searchProducts}
                value={searchQuery}
                onChangeText={text => setSearchQuery(text)}
                onSubmitEditing={() => fetchProducts(searchQuery)}
                style={styles.searchInput}
                placeholderTextColor={colors.gray}
                returnKeyType="search"
              />
              {searchQuery ? (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                    fetchProducts('');
                  }}
                >
                  <Text style={styles.searchCloseText}>
                    {shopPageConstants.closeX}
                  </Text>
                </TouchableOpacity>
              ) : (
                <SearchIcon color={colors.gray} />
              )}
            </View>
          </>
        )}
      </View>
      <View style={styles.productsHeaderContainer}>
        <Text style={styles.productsTitle}>
          {gender}'s {categoryName.toLowerCase()}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagsScrollView}
        >
          {subcategoryTags.map(tag => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tagButton,
                activeTag !== tag && { backgroundColor: colors.lightGray },
              ]}
              onPress={() => applyFilters(tag)}
            >
              <Text
                style={[
                  styles.tagText,
                  activeTag !== tag && { color: colors.black },
                ]}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.filterSortBar}>
        <TouchableOpacity
          style={styles.filterButton}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate('FiltersScreen', {
              categoryId,
              categoryName,
              gender,
              currentFilters: route.params?.appliedFilters,
            })
          }
        >
          <FilterIcon />
          <Text style={styles.filterIconText}>{categoryProducts.filters}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sortButton}
          activeOpacity={0.7}
          onPress={() => setIsSortDrawerVisible(true)}
        >
          <SortIcon />
          <Text style={styles.sortText}>
            {sortOptions.find(opt => opt?.id === selectedSort)?.label ||
              'Sort by'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewToggleButton}
          activeOpacity={0.7}
          onPress={() => setIsGridView(!isGridView)}
        >
          {isGridView ? <ListIcon /> : <GridIcon />}
        </TouchableOpacity>
      </View>

      {loading && products.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.red} />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.id?.toString()}
          key={isGridView ? 'G' : 'L'}
          numColumns={isGridView ? 2 : 1}
          contentContainerStyle={styles.productsListContent}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchProducts}
          refreshing={loading}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {categoryProducts.noProductsFound}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default CategoryProducts;
