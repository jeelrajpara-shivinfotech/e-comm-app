import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  StatusBar,
  Share,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BASE_IMAGE_URL } from '@env';
import { colors } from '../../theme';
import Typography from '../../theme/fonts';
import { getProductDetailApi, getProductListApi } from '../../api/productApi';
import { handleApiResponse, SafeImage } from '../../utils/commonFunctions';
import {
  Product,
  Variant,
  ProductListResponse,
} from '../../interceptors/ProductInterface';
import { MainStackParamList } from '../../interface/navigationProps';
import {
  navigationRoutes,
  productViewConstants,
} from '../../constants/ShopPageConstants';
import { productScreenStyles as styles } from './productScreen.styles';
import BackIcon from '../../assets/svg/BackIcon';
import { StarIcon } from '../../assets/svg/StarIcon';
import FavIcon from '../../assets/svg/FavIcon';
import BaseButton from '../../components/BaseButton';
import BaseBottomDrawer from '../../components/BaseBottomDrawer';
import Svg, { Path } from 'react-native-svg';
import ChevronRightIcon from '../../assets/svg/ChevronRightIcon';
import ShareIcon from '../../assets/svg/ShareIcon';
import ChevronDown from '../../assets/svg/ChevronDown';
import { homePageConstants } from '../../constants/HomePageConstants';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

const ProductScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<MainStackParamList, 'ProductCardScreen'>>();
  const { productId } = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeVariant, setActiveVariant] = useState<Variant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('S');
  const { isProductFavorited, getWishlistItemId, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart: addCartItem } = useCart();
  const variantIds = product?.variants?.map(v => v.id) || [];
  const isFavorite = product ? isProductFavorited(product.id, variantIds) : false;
  const [loading, setLoading] = useState<boolean>(true);
  const [isSizeDrawerVisible, setIsSizeDrawerVisible] =
    useState<boolean>(false);
  const [isColorDrawerVisible, setIsColorDrawerVisible] =
    useState<boolean>(false);
  const [isShippingExpanded, setIsShippingExpanded] = useState<boolean>(false);
  const [isSupportExpanded, setIsSupportExpanded] = useState<boolean>(false);

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];

  useEffect(() => {
    fetchProductDetails();
    fetchRelatedProducts();
  }, [productId]);

  const fetchProductDetails = async () => {
    setLoading(true);
    const apiCall = getProductDetailApi(productId);
    await handleApiResponse(
      apiCall,
      response => {
        if (response && response.data) {
          const fetchedProduct: Product = {
            id: response.data.id,
            name: response.data.name,
            variants: response.data.variants,
            category: { id: 0, category_name: 'Short dress' },
          };
          setProduct(fetchedProduct);
          if (fetchedProduct.variants && fetchedProduct.variants.length > 0) {
            setActiveVariant(fetchedProduct.variants[0]);
          }
        }
      },
      undefined,
      false,
      true,
    );
    setLoading(false);
  };

  const fetchRelatedProducts = async () => {
    const payload = {
      page: 1,
      pageSize: 6,
    };
    const apiCall = getProductListApi(payload);
    await handleApiResponse(
      apiCall,
      (response: ProductListResponse) => {
        if (
          response &&
          response.data &&
          Array.isArray(response.data.products)
        ) {
          const filtered = response.data.products.filter(
            p => p.id !== productId,
          );
          setRelatedProducts(filtered);
        }
      },
      undefined,
      false,
      true,
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${productViewConstants.shareProduct} ${product?.name}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectColor = (colorName: string) => {
    if (product && product.variants) {
      const match = product.variants.find(
        v => v.color.toLowerCase() === colorName.toLowerCase(),
      );
      if (match) {
        setActiveVariant(match);
      }
    }
    setIsColorDrawerVisible(false);
  };

  const handleFavoritePress = async () => {
    if (!product) return;
    const variantIds = product.variants?.map(v => v.id) || [];
    const isFav = isProductFavorited(product.id, variantIds);
    if (isFav) {
      const wishlistId = getWishlistItemId(product.id, variantIds);
      if (wishlistId !== null) {
        await removeFromWishlist(wishlistId);
      }
    } else {
      if (activeVariant) {
        await addToWishlist(activeVariant.id);
      } else {
        setIsSizeDrawerVisible(true);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!product || !activeVariant) return;
    const success = await addCartItem(product.id, activeVariant.id, 1);
    if (success) {
      setIsSizeDrawerVisible(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<StarIcon key={i} filled={i <= rating} />);
    }
    return <View style={styles.starsRow}>{stars}</View>;
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color={colors.red} />
      </View>
    );
  }

  if (!product || !activeVariant) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ ...Typography.regular16, color: colors.gray }}>
          {productViewConstants.noDetailsAvailable}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: colors.red,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              ...Typography.regular14,
              color: colors.white,
              fontWeight: '700',
            }}
          >
            {productViewConstants.goBack}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const availableColors = Array.from(
    new Set(product.variants.map(v => v.color)),
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.white }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {activeVariant.product_title_name || product.name}
          </Text>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <ShareIcon />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <SafeImage
            uri={`${BASE_IMAGE_URL}/${activeVariant.image.image_path}`}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.selectorsRow}>
          <TouchableOpacity
            style={styles.dropdownButton}
            activeOpacity={0.8}
            onPress={() => setIsSizeDrawerVisible(true)}
          >
            <Text style={styles.dropdownButtonText}>{productViewConstants.size} {selectedSize}</Text>
            <ChevronDown />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dropdownButton}
            activeOpacity={0.8}
            onPress={() => setIsColorDrawerVisible(true)}
          >
            <Text style={styles.dropdownButtonText} numberOfLines={1}>
              {productViewConstants.color} {activeVariant.color}
            </Text>
            <ChevronDown />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.favoriteButton}
            activeOpacity={0.8}
            onPress={handleFavoritePress}
          >
            <FavIcon
              width={18}
              height={18}
              color={isFavorite ? colors.dangerRed : colors.gray}
              fill={isFavorite ? colors.dangerRed : 'none'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.brandPriceRow}>
            <Text style={styles.brandText} numberOfLines={1}>
              {activeVariant.product_title_name}
            </Text>
            <Text style={styles.priceText}>{homePageConstants.dollarSign}{activeVariant.price}</Text>
          </View>
          <Text style={styles.nameText}>{product.name}</Text>

          <View style={styles.ratingRow}>
            {renderStars(5)}
            <Text style={styles.reviewCount}>{productViewConstants.reviewCount}</Text>
          </View>

          <Text style={styles.descriptionText}>
            {productViewConstants.reviewDescription}
          </Text>

          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.accordionHeader}
            activeOpacity={0.7}
            onPress={() => setIsShippingExpanded(!isShippingExpanded)}
          >
            <Text style={styles.accordionTitle}>{productViewConstants.shippingInfo}</Text>
            <ChevronRightIcon />
          </TouchableOpacity>
          {isShippingExpanded && (
            <View style={styles.accordionContent}>
              <Text style={styles.accordionText}>
                {productViewConstants.shippingDescription}
              </Text>
            </View>
          )}
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.accordionHeader}
            activeOpacity={0.7}
            onPress={() => setIsSupportExpanded(!isSupportExpanded)}
          >
            <Text style={styles.accordionTitle}>{productViewConstants.support}</Text>
            <ChevronRightIcon />
          </TouchableOpacity>
          {isSupportExpanded && (
            <View style={styles.accordionContent}>
              <Text style={styles.accordionText}>
                {productViewConstants.supportDescription}
              </Text>
            </View>
          )}

          <View style={styles.divider} />
        </View>
        {relatedProducts.length > 0 && (
          <View style={styles.relatedSection}>
            <View style={styles.relatedTitleRow}>
              <Text style={styles.relatedTitle}>{productViewConstants.canAlsoLike}</Text>
              <Text style={styles.relatedItemsCount}>
                {relatedProducts.length} {productViewConstants.items}
              </Text>
            </View>

            <FlatList
              data={relatedProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedList}
              keyExtractor={(item: Product) => item.id.toString()}
              renderItem={({ item }: { item: Product }) => {
                const relVariant = item.variants?.[0];
                return (
                  <TouchableOpacity
                    style={styles.relatedCard}
                    activeOpacity={0.8}
                    onPress={() => {
                      navigation.navigate(navigationRoutes.productCardScreen, {
                        productId: item.id,
                      });
                    }}
                  >
                    <View style={styles.relatedImageContainer}>
                      <SafeImage
                        uri={`${BASE_IMAGE_URL}/${relVariant.image.image_path}`}
                        style={styles.relatedImage}
                        resizeMode="cover"
                      />
                    </View>
                    <Text style={styles.relatedBrand} numberOfLines={1}>
                      {relVariant?.product_title_name}
                    </Text>
                    <Text style={styles.relatedName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.relatedPrice}>
                      ${relVariant?.price}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <BaseButton
          title={productViewConstants.addToCart}
          variant="primary"
          fullWidth
          onPress={() => setIsSizeDrawerVisible(true)}
        />
      </SafeAreaView>
      <BaseBottomDrawer
        visible={isSizeDrawerVisible}
        onClose={() => setIsSizeDrawerVisible(false)}
        title={productViewConstants.selectSize}
      >
        <View style={styles.sizeDrawerContainer}>
          <View style={styles.sizeGrid}>
            {sizeOptions.map(size => {
              const isActive = selectedSize === size;
              return (
                <TouchableOpacity
                  key={size}
                  activeOpacity={0.8}
                  style={[
                    styles.sizeGridItem,
                    isActive && styles.sizeGridItemActive,
                  ]}
                  onPress={() => {
                    setSelectedSize(size);
                  }}
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

          <TouchableOpacity style={styles.sizeInfoRow} activeOpacity={0.7}>
            <Text style={styles.sizeInfoText}>{productViewConstants.sizeInfo}</Text>
            <ChevronRightIcon />
          </TouchableOpacity>

          <BaseButton
            title={productViewConstants.addToCart}
            variant="primary"
            fullWidth
            containerStyle={styles.addToCartButton}
            onPress={handleAddToCart}
          />
        </View>
      </BaseBottomDrawer>
      <BaseBottomDrawer
        visible={isColorDrawerVisible}
        onClose={() => setIsColorDrawerVisible(false)}
        title={productViewConstants.color}
        options={availableColors?.map(color => ({ id: color, label: color }))}
        selectedValue={activeVariant.color}
        onSelect={option => handleSelectColor(option.id)}
      />
    </View>
  );
};

export default ProductScreen;
