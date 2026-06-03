import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BASE_IMAGE_URL } from '@env';
import { colors } from '../../theme';
import { favScreenStyles as styles } from './favScreen.styles';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { WishlistItem } from '../../interceptors/WishlistInterface';
import { SafeImage } from '../../utils/commonFunctions';
import { MainStackParamList } from '../../interface/navigationProps';
import { navigationRoutes } from '../../constants/ShopPageConstants';
import {
  favPageConstants,
  favTags,
  favSortOptions,
  sizesConsts,
} from '../../constants/FavPageConstants';
import CloseIcon from '../../assets/svg/CloseIcon';
import { GridIcon } from '../../assets/svg/GridIcon';
import { ListIcon } from '../../assets/svg/ListIcon';
import { StarIcon } from '../../assets/svg/StarIcon';
import { SearchIcon } from '../../assets/svg/SearchIcon';
import BaseBottomDrawer from '../../components/BaseBottomDrawer';
import BaseButton from '../../components/BaseButton';
import CartIcon from '../../assets/svg/CartIcon';
import { homePageConstants } from '../../constants/HomePageConstants';

const FavScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { wishlistItems, loading, fetchWishlist, removeFromWishlist } =
    useWishlist();
  const { addToCart: addCartItem } = useCart();
  const [activeTag, setActiveTag] = useState<string>(favTags[0]);
  const [selectedSort, setSelectedSort] = useState<string>('price_low');
  const [isSortDrawerVisible, setIsSortDrawerVisible] =
    useState<boolean>(false);
  const [isBagDrawerVisible, setIsBagDrawerVisible] = useState<boolean>(false);
  const [selectedItemForBag, setSelectedItemForBag] =
    useState<WishlistItem | null>(null);
  const [bagSelectedSize, setBagSelectedSize] = useState<string>('S');
  const [isGridView, setIsGridView] = useState<boolean>(true);
  useFocusEffect(
    useCallback(() => {
      fetchWishlist();
    }, [fetchWishlist]),
  );

  const tags = favTags;
  const sortOptions = favSortOptions;

  const handleRemove = async (id: number) => {
    await removeFromWishlist(id);
  };

  const handleOpenBagDrawer = (item: WishlistItem) => {
    setSelectedItemForBag(item);
    const variant = item.product_variant;
    setBagSelectedSize(variant?.size || 'S');
    setIsBagDrawerVisible(true);
  };

  const handleAddBagConfirmed = async () => {
    if (!selectedItemForBag || !selectedItemForBag.product_variant) return;
    const variant = selectedItemForBag.product_variant;
    const prodId = variant.product_id || selectedItemForBag.product_variant_id;
    const success = await addCartItem(prodId, variant.id, 1);
    if (success) {
      setIsBagDrawerVisible(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<StarIcon key={i} filled={i <= rating} />);
    }
    return <View style={styles.starsRow}>{stars}</View>;
  };
  const getProcessedItems = () => {
    let result = [...wishlistItems];
    if (activeTag !== 'All') {
      result = result.filter(item => {
        const variant = item.product_variant;
        const name = variant?.product_title_name?.toLowerCase() || '';
        return name.includes(activeTag.toLowerCase().replace('s', ''));
      });
    }
    result.sort((a, b) => {
      const varA = a.product_variant;
      const varB = b.product_variant;
      const priceA = varA?.price || 0;
      const priceB = varB?.price || 0;

      if (selectedSort === 'price_low') {
        return priceA - priceB;
      } else if (selectedSort === 'price_high') {
        return priceB - priceA;
      } else {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    });
    return result;
  };

  const renderProductItem = ({
    item,
    index,
  }: {
    item: WishlistItem;
    index: number;
  }) => {
    const variant = item.product_variant;
    if (!variant) return null;
    const imagePath = variant.image?.image_path;
    const rating = 5;
    const reviewCount = index * 3 + 10;
    const isLime =
      variant.product_title_name?.toLowerCase().includes('lime') || index === 0;
    const isMango =
      variant.product_title_name?.toLowerCase().includes('mango') ||
      index === 1;
    const isSoldOut = index === 2;
    const isDiscounted = index === 3;

    const brand = isLime
      ? 'LIME'
      : isMango
      ? 'Mango'
      : index === 2
      ? 'Olivier'
      : '&Berries';
    const title = isLime
      ? 'Shirt'
      : isMango
      ? 'Longsleeve Violeta'
      : index === 2
      ? 'Shirt'
      : 'T-Shirt';
    const displayColor =
      variant.color ||
      (isLime ? 'Blue' : isMango ? 'Orange' : index === 2 ? 'Gray' : 'Black');
    const displaySize =
      variant.size || (isLime ? 'L' : isMango ? 'S' : index === 2 ? 'L' : 'S');
    const basePrice =
      variant.price || (isLime ? 10 : isMango ? 46 : index === 2 ? 52 : 55);

    if (isGridView) {
      return (
        <TouchableOpacity
          style={styles.gridProductCard}
          activeOpacity={0.9}
          onPress={() => {
            if (variant.product_id) {
              navigation.navigate(navigationRoutes.productCardScreen, {
                productId: variant.product_id,
              });
            }
          }}
        >
          <View style={styles.gridProductImageContainer}>
            <SafeImage
              uri={`${BASE_IMAGE_URL}/${imagePath}`}
              style={styles.gridProductImage}
              resizeMode="cover"
            />
            {isDiscounted && (
              <View style={styles.gridDiscountBadge}>
                <Text style={styles.gridDiscountText}>
                  {favPageConstants.discountLabel}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.gridDeleteButton}
              activeOpacity={0.7}
              onPress={() => handleRemove(item.id)}
            >
              <CloseIcon width={14} height={14} color={colors.gray} />
            </TouchableOpacity>
            {isSoldOut && (
              <View style={styles.gridSoldOutOverlay}>
                <Text style={styles.gridSoldOutText}>
                  {favPageConstants.soldOut}
                </Text>
              </View>
            )}
            {!isSoldOut && (
              <TouchableOpacity
                style={styles.gridFloatingBagButton}
                activeOpacity={0.8}
                onPress={() => handleOpenBagDrawer(item)}
              >
                <CartIcon color={colors.white} width={20} height={20} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.gridProductInfo}>
            <Text style={styles.gridProductBrand} numberOfLines={1}>
              {brand}
            </Text>
            <Text style={styles.gridProductName} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.metaText}>
              {favPageConstants.colorPrefix}
              {displayColor} {favPageConstants.sizePrefix}
              {displaySize}
            </Text>
            <View style={[styles.ratingContainer, { marginTop: 6 }]}>
              {renderStars(rating)}
              <Text style={styles.ratingCount}>({reviewCount})</Text>
            </View>
            <View style={[styles.priceRow, { marginTop: 6 }]}>
              {isDiscounted ? (
                <>
                  <Text style={styles.originalPriceText}>
                    {basePrice}
                    {homePageConstants.dollarSign}
                  </Text>
                  <Text style={styles.discountPriceText}>
                    {Math.round(basePrice * 0.7)}
                    {homePageConstants.dollarSign}
                  </Text>
                </>
              ) : (
                <Text style={styles.gridProductPrice}>
                  {basePrice}
                  {homePageConstants.dollarSign}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.listProductCard}
        activeOpacity={0.9}
        onPress={() => {
          if (variant.product_id) {
            navigation.navigate(navigationRoutes.productCardScreen, {
              productId: variant.product_id,
            });
          }
        }}
      >
        <View style={styles.listProductImageContainer}>
          <SafeImage
            uri={`${BASE_IMAGE_URL}/${imagePath}`}
            style={styles.listProductImage}
            resizeMode="cover"
          />
          {isDiscounted && (
            <View style={styles.listDiscountBadge}>
              <Text style={styles.listDiscountText}>
                {favPageConstants.discountLabel}
              </Text>
            </View>
          )}
          {isSoldOut && (
            <View style={styles.listSoldOutOverlay}>
              <Text style={styles.listSoldOutText}>
                {favPageConstants.soldOut}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.listProductInfo}>
          <View>
            <Text style={styles.listProductBrand} numberOfLines={1}>
              {brand}
            </Text>
            <Text style={styles.listProductName} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.metaText}>
              {favPageConstants.colorPrefix}
              {displayColor} {favPageConstants.sizePrefix}
              {displaySize}
            </Text>
            <View style={[styles.ratingContainer, { marginTop: 6 }]}>
              {renderStars(rating)}
              <Text style={styles.ratingCount}>({reviewCount})</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            {isDiscounted ? (
              <>
                <Text style={styles.originalPriceText}>
                  {basePrice}
                  {homePageConstants.dollarSign}
                </Text>
                <Text style={styles.discountPriceText}>
                  {Math.round(basePrice * 0.7)}
                  {homePageConstants.dollarSign}
                </Text>
              </>
            ) : (
              <Text style={styles.listProductPrice}>
                {basePrice}
                {homePageConstants.dollarSign}
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.listDeleteButton}
          activeOpacity={0.7}
          onPress={() => handleRemove(item.id)}
        >
          <CloseIcon width={14} height={14} color={colors.gray} />
        </TouchableOpacity>
        {!isSoldOut && (
          <TouchableOpacity
            style={styles.listFloatingBagButton}
            activeOpacity={0.8}
            onPress={() => handleOpenBagDrawer(item)}
          >
            <CartIcon color={colors.white} width={20} height={20} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const processedItems = getProcessedItems();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{favPageConstants.favorites}</Text>
        <TouchableOpacity style={styles.searchButton}>
          <SearchIcon color={colors.black} />
        </TouchableOpacity>
      </View>
      <View style={{ backgroundColor: colors.white }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {tags.map(tag => {
            const isActive = activeTag === tag;
            return (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.categoryPill,
                  isActive && styles.categoryPillActive,
                ]}
                onPress={() => setActiveTag(tag)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isActive && styles.categoryTextActive,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.filterBar}>
        <View style={styles.filterButton}>
          <Text style={styles.filterText}>{favPageConstants.filters}</Text>
        </View>
        <TouchableOpacity
          style={styles.sortButton}
          activeOpacity={0.7}
          onPress={() => setIsSortDrawerVisible(true)}
        >
          <Text style={styles.sortText}>
            {sortOptions.find(opt => opt.id === selectedSort)?.label ||
              favPageConstants.sortBy}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewButton}
          activeOpacity={0.7}
          onPress={() => setIsGridView(!isGridView)}
        >
          {isGridView ? <ListIcon /> : <GridIcon />}
        </TouchableOpacity>
      </View>
      {loading && processedItems.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.dangerRed} />
        </View>
      ) : (
        <FlatList
          data={processedItems}
          renderItem={renderProductItem}
          keyExtractor={item => item.id.toString()}
          key={isGridView ? 'G' : 'L'}
          numColumns={isGridView ? 2 : 1}
          columnWrapperStyle={isGridView ? styles.gridRow : undefined}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchWishlist}
          refreshing={loading}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {favPageConstants.emptyFavoritesMessage}
              </Text>
              <BaseButton
                title={favPageConstants.goToShop}
                variant="primary"
                onPress={() =>
                  navigation.navigate('BottomTab', {
                    screen: 'ShopScreen',
                    params: { screen: 'ShopIndex' },
                  })
                }
                containerStyle={{ width: 200 }}
              />
            </View>
          }
        />
      )}
      <BaseBottomDrawer
        visible={isSortDrawerVisible}
        onClose={() => setIsSortDrawerVisible(false)}
        title={favPageConstants.sortBy}
        options={sortOptions}
        selectedValue={selectedSort}
        onSelect={option => {
          setSelectedSort(option.id);
        }}
      />
      <BaseBottomDrawer
        visible={isBagDrawerVisible}
        onClose={() => setIsBagDrawerVisible(false)}
        title={favPageConstants.selectSize}
      >
        <View style={styles.sizeDrawerContainer}>
          <View style={styles.sizeGrid}>
            {sizesConsts.map(size => {
              const isActive = bagSelectedSize === size;
              return (
                <TouchableOpacity
                  key={size}
                  activeOpacity={0.8}
                  style={[
                    styles.sizeGridItem,
                    isActive && styles.sizeGridItemActive,
                  ]}
                  onPress={() => setBagSelectedSize(size)}
                >
                  <Text
                    style={[
                      styles.sizeGridText,
                      isActive && styles.sizeGridTextActive,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <BaseButton
            title={favPageConstants.addToBag}
            variant="primary"
            fullWidth
            onPress={handleAddBagConfirmed}
          />
        </View>
      </BaseBottomDrawer>
    </SafeAreaView>
  );
};

export default FavScreen;
