import BaseButton from '../../components/BaseButton';
import { colors } from '../../theme';
import { homeScreenStyles } from './homeScreen.styles';
import { getProductListApi } from '../../api/productApi';
import {
  Product,
  ProductListResponse,
} from '../../interceptors/ProductInterface';
import { handleApiResponse, SafeImage } from '../../utils/commonFunctions';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import { BASE_IMAGE_URL } from '@env';
import { homePageConstants } from '../../constants/HomePageConstants';

const HomeScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);
  const payload = {
    page: 1,
    pageSize: 10,
  };
  const fetchProducts = async () => {
    setLoading(true);
    const apiCall = getProductListApi(payload);
    await handleApiResponse(
      apiCall,
      (response: ProductListResponse) => {
        if (
          response &&
          response.data &&
          Array.isArray(response.data.products)
        ) {
          setProducts(response.data.products);
        }
      },
      undefined,
      false,
      true,
    );
    setLoading(false);
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const variant = item.variants?.[0];
    const imagePath = variant?.image?.image_path;

    return (
      <TouchableOpacity
        style={homeScreenStyles.productCard}
        activeOpacity={0.8}
      >
        <View style={homeScreenStyles.productImageContainer}>
          <SafeImage uri={`${BASE_IMAGE_URL}/${imagePath}`} style={homeScreenStyles.productImage} resizeMode="cover" />
          <View style={homeScreenStyles.newBadge}>
            <Text style={homeScreenStyles.newBadgeText}>
              {homePageConstants.new}
            </Text>
          </View>
        </View>
        <Text style={homeScreenStyles.productBrand} numberOfLines={1}>
          {item.category?.category_name}
        </Text>
        <Text style={homeScreenStyles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text
          style={homeScreenStyles.productPrice}
        >{`${variant.price}${homePageConstants.dollarSign}`}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={homeScreenStyles.container}
      contentContainerStyle={homeScreenStyles.contentContainer}
    >
      <ImageBackground
        source={require('../../assets/images/HomeBanner.png')}
        style={homeScreenStyles.banner}
        resizeMode="cover"
      >
        <View style={homeScreenStyles.bannerContent}>
          <Text style={homeScreenStyles.bannerTitle}>
            {homePageConstants.fashion}
          </Text>
          <Text style={homeScreenStyles.bannerTitle}>
            {homePageConstants.sale}
          </Text>
          <BaseButton
            title={homePageConstants.check}
            variant="primary"
            containerStyle={homeScreenStyles.checkButton}
          />
        </View>
      </ImageBackground>
      <View style={homeScreenStyles.sectionContainer}>
        <View style={homeScreenStyles.sectionHeader}>
          <View style={homeScreenStyles.sectionTitleContainer}>
            <Text style={homeScreenStyles.sectionTitle}>
              {homePageConstants.new}
            </Text>
            <Text style={homeScreenStyles.sectionSubtitle}>
              {homePageConstants.subtitle}
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={homeScreenStyles.viewAllText}>
              {homePageConstants.viewAll}
            </Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color={colors.red} />
        ) : (
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={homeScreenStyles.productList}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
