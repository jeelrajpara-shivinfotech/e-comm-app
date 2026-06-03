import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BASE_IMAGE_URL } from '@env';
import Toast from 'react-native-toast-message';

import { colors } from '../../theme';
import { bagScreenStyles as styles } from './bagScreen.styles';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { CartItem } from '../../interceptors/CartInterface';
import { SafeImage } from '../../utils/commonFunctions';
import { MainStackParamList } from '../../interface/navigationProps';
import {
  bagPageConstants,
  STATIC_PROMO_CODES,
  StaticPromoCode,
} from '../../constants/BagPageConstants';
import CloseIcon from '../../assets/svg/CloseIcon';
import { SearchIcon } from '../../assets/svg/SearchIcon';
import ArrowRight from '../../assets/svg/ArrowRight';
import BaseButton from '../../components/BaseButton';
import BaseBottomDrawer from '../../components/BaseBottomDrawer';
import MinusIcon from '../../assets/svg/MinusIcon';
import PlusIcon from '../../assets/svg/PlusIcon';
import EllipsisIcon from '../../assets/svg/EllipsisIcon';

const BagScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {
    cartItems,
    loading,
    fetchCart,
    addToCart,
    removeFromCart,
    cartTotal,
  } = useCart();
  const { addToWishlist } = useWishlist();
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [isPromoDrawerVisible, setIsPromoDrawerVisible] =
    useState<boolean>(false);
  const [appliedPromo, setAppliedPromo] = useState<StaticPromoCode | null>(
    null,
  );
  const [drawerPromoInput, setDrawerPromoInput] = useState<string>('');
  useFocusEffect(
    useCallback(() => {
      fetchCart();
      setActiveMenuId(null);
    }, [fetchCart]),
  );

  const handleIncrement = async (item: CartItem) => {
    setActiveMenuId(null);
    await addToCart(
      item.product_id,
      item.product_variant_id,
      item.quantity + 1,
      false,
    );
  };

  const handleDecrement = async (item: CartItem) => {
    setActiveMenuId(null);
    if (item.quantity > 1) {
      await addToCart(
        item.product_id,
        item.product_variant_id,
        item.quantity - 1,
        false,
      );
    } else {
      await removeFromCart(item.id);
    }
  };

  const handleAddToFavorites = async (item: CartItem) => {
    setActiveMenuId(null);
    if (!item.productVariant) return;

    const success = await addToWishlist(item.product_variant_id);
    if (success) {
      Toast.show({
        type: 'success',
        text1: bagPageConstants.addedToFavourites,
        text2: `${
          item.productData?.name || item.productVariant.product_title_name
        } ${bagPageConstants.favoritedMessage}`,
      });
    }
  };

  const handleDeleteFromList = async (id: number) => {
    setActiveMenuId(null);
    await removeFromCart(id);
  };

  const handleApplyPromo = (promo: StaticPromoCode) => {
    setAppliedPromo(promo);
    setIsPromoDrawerVisible(false);
    Toast.show({
      type: 'success',
      text1: bagPageConstants.promoApplied,
      text2: bagPageConstants.promoAppliedMessage(promo.code),
    });
  };

  const handleClearPromo = () => {
    setAppliedPromo(null);
  };

  const handleApplyCustomPromo = () => {
    const match = STATIC_PROMO_CODES.find(
      promo =>
        promo.code.toLowerCase() === drawerPromoInput.trim().toLowerCase(),
    );
    if (match) {
      handleApplyPromo(match);
      setDrawerPromoInput('');
    } else {
      Toast.show({
        type: 'error',
        text1: bagPageConstants.invalidPromo,
        text2: bagPageConstants.invalidPromoMessage,
      });
    }
  };

  const discountedTotal = appliedPromo
    ? Math.round(cartTotal * (1 - appliedPromo.discount / 100))
    : cartTotal;

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const variant = item.productVariant;
    if (!variant) return null;

    return (
      <View style={styles.cartCard}>
        <View style={styles.imageContainer}>
          <SafeImage
            uri={`${BASE_IMAGE_URL}/${variant.image?.image_path}`}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.infoContainer}>
          <View>
            <Text style={styles.brandText} numberOfLines={1}>
              {variant.product_title_name}
            </Text>
            <Text style={styles.nameText} numberOfLines={1}>
              {item.productData?.name || variant.product_title_name}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{bagPageConstants.colorLabel}</Text>
              <Text style={styles.metaValue}>{variant.color}</Text>
              <Text style={styles.metaText}>{bagPageConstants.sizeLabel}</Text>
              <Text style={styles.metaValue}>{variant.size}</Text>
            </View>
          </View>
          <View style={styles.quantityPriceRow}>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                activeOpacity={0.7}
                onPress={() => handleDecrement(item)}
              >
                <MinusIcon />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                activeOpacity={0.7}
                onPress={() => handleIncrement(item)}
              >
                <PlusIcon />
              </TouchableOpacity>
            </View>
            <Text style={styles.priceText}>
              {variant.price * item.quantity}
              {bagPageConstants.currencySymbol}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          activeOpacity={0.7}
          onPress={() =>
            setActiveMenuId(activeMenuId === item.id ? null : item.id)
          }
        >
          <EllipsisIcon />
        </TouchableOpacity>
        {activeMenuId === item.id && (
          <View style={styles.menuPopover}>
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.6}
              onPress={() => handleAddToFavorites(item)}
            >
              <Text style={styles.menuItemText}>
                {bagPageConstants.addToFavorites}
              </Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.6}
              onPress={() => handleDeleteFromList(item.id)}
            >
              <Text style={styles.menuItemText}>
                {bagPageConstants.deleteFromList}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{bagPageConstants.myBagTitle}</Text>
        <TouchableOpacity style={styles.searchButton}>
          <SearchIcon color={colors.black} />
        </TouchableOpacity>
      </View>

      {loading && cartItems.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.dangerRed} />
        </View>
      ) : (
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.cartList}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchCart}
          refreshing={loading}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {bagPageConstants.emptyBagMessage}
              </Text>
              <BaseButton
                title={bagPageConstants.shopNow}
                variant="primary"
                onPress={() =>
                  navigation.navigate(bagPageConstants.bottomTabRoute, {
                    screen: bagPageConstants.shopScreenRoute,
                    params: { screen: bagPageConstants.shopIndexRoute },
                  })
                }
                containerStyle={{ width: 200 }}
              />
            </View>
          }
          ListFooterComponent={
            cartItems.length > 0 ? (
              appliedPromo ? (
                <View style={styles.appliedPromoWrapper}>
                  <Text style={styles.appliedPromoText}>
                    {appliedPromo.code}
                  </Text>
                  <TouchableOpacity
                    style={styles.appliedPromoCancel}
                    activeOpacity={0.7}
                    onPress={handleClearPromo}
                  >
                    <CloseIcon width={12} height={12} color={colors.gray} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.promoContainer}
                  activeOpacity={0.8}
                  onPress={() => setIsPromoDrawerVisible(true)}
                >
                  <Text style={[styles.promoInput, { color: colors.gray }]}>
                    {bagPageConstants.enterPromoPlaceholder}
                  </Text>
                  <View style={styles.promoButton}>
                    <ArrowRight width={16} height={16} color={colors.white} />
                  </View>
                </TouchableOpacity>
              )
            ) : null
          }
        />
      )}
      {cartItems.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {bagPageConstants.totalAmountLabel}
            </Text>
            <Text style={styles.summaryValue}>
              {discountedTotal}
              {bagPageConstants.currencySymbol}
            </Text>
          </View>
          <BaseButton
            title={bagPageConstants.checkoutBtn}
            variant="primary"
            fullWidth
            containerStyle={styles.checkoutButton}
            onPress={() => {
              navigation.navigate('PaymentMethodsScreen', {
                totalAmount: discountedTotal,
              });
            }}
          />
        </View>
      )}
      <BaseBottomDrawer
        visible={isPromoDrawerVisible}
        onClose={() => setIsPromoDrawerVisible(false)}
        title={bagPageConstants.emptyString}
      >
        <View style={styles.promoSheetContainer}>
          <View style={styles.promoSheetInputRow}>
            <TextInput
              style={styles.promoSheetInput}
              placeholder={bagPageConstants.enterPromoPlaceholder}
              placeholderTextColor={colors.gray}
              value={drawerPromoInput}
              onChangeText={setDrawerPromoInput}
            />
            <TouchableOpacity
              style={styles.promoButton}
              activeOpacity={0.8}
              onPress={handleApplyCustomPromo}
            >
              <ArrowRight width={16} height={16} color={colors.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.promoSheetTitle}>
            {bagPageConstants.yourPromoCodesTitle}
          </Text>
          <View style={styles.promoList}>
            {STATIC_PROMO_CODES.map(promo => (
              <View key={promo.id} style={styles.promoCard}>
                <View style={styles.promoCardLeft}>
                  <View
                    style={[
                      styles.promoCardLeftImage,
                      { backgroundColor: promo.color },
                    ]}
                  />
                  <Text style={styles.promoCardLeftText}>{promo.discount}</Text>
                  <Text style={styles.promoCardLeftSubtext}>
                    {bagPageConstants.percentOff}
                  </Text>
                </View>
                <View style={styles.promoCardMiddle}>
                  <Text style={styles.promoCardTitle}>{promo.title}</Text>
                  <Text style={styles.promoCardCode}>{promo.code}</Text>
                  <Text style={styles.promoCardValidity}>{promo.validity}</Text>
                </View>
                <View style={styles.promoCardRight}>
                  <TouchableOpacity
                    style={styles.promoApplyButton}
                    activeOpacity={0.8}
                    onPress={() => handleApplyPromo(promo)}
                  >
                    <Text style={styles.promoApplyButtonText}>
                      {bagPageConstants.applyBtn}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </BaseBottomDrawer>
    </SafeAreaView>
  );
};

export default BagScreen;
