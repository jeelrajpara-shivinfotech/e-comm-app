import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useConfirmPayment, useStripe } from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';

import { colors } from '../../theme';
import Typography from '../../theme/fonts';
import BackIcon from '../../assets/svg/BackIcon';
import CheckIcon from '../../assets/svg/CheckIcon';
import BaseButton from '../../components/BaseButton';
import BaseTextInput from '../../components/BaseTextInput';
import { createPaymentApi, verifyPaymentApi } from '../../api/paymentApi';
import { useCart } from '../../context/CartContext';
import { MainStackParamList } from '../../interface/navigationProps';
import { bagPageConstants } from '../../constants/BagPageConstants';
import {
  cardRegex,
  visaRegex,
  nonDigitsRegex,
  digitsChunksRegex,
  whitespaceRegex,
  creditCardNumberRegex,
  cardExpiryRegex,
  cardCvvRegex,
  cardNameRegex,
} from '../../utils/regex';
import { loginPageConstants, signUpPageConstants } from '../../constants/AuthPageConstants';
import { paymentMethodScreenStyles } from './bagScreen.styles';

type PaymentScreenRouteProp = RouteProp<MainStackParamList, 'PaymentMethodsScreen'>;
type CheckoutViewType = 'checkout' | 'saved_cards';
type DeliveryMethodType = 'fedex' | 'usps' | 'dhl';

interface SavedCard {
  id: string;
  brand: 'Visa' | 'Mastercard' | 'Unknown';
  last4: string;
  holderName: string;
  expiryDate: string;
  theme: 'black' | 'silver' | 'purple';
}

interface ShippingDetails {
  fullName: string;
  addressLine: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const PaymentMethodsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<PaymentScreenRouteProp>();
  const { totalAmount } = route.params;
  const { fetchCart } = useCart();
  const { confirmPayment } = useConfirmPayment();
  const { createPaymentMethod } = useStripe();
  const [currentView, setCurrentView] = useState<CheckoutViewType>('checkout');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethodType>(bagPageConstants.courierFedex);
  const courierFees: Record<DeliveryMethodType, number> = {
    [bagPageConstants.courierFedex]: 15,
    [bagPageConstants.courierUsps]: 10,
    [bagPageConstants.courierDhl]: 20,
  };
  const [savedCards, setSavedCards] = useState<SavedCard[]>([
    {
      id: bagPageConstants.defaultCard1Id,
      brand: bagPageConstants.brandMastercard,
      last4: bagPageConstants.defaultCard1Last4,
      holderName: bagPageConstants.defaultCard1Holder,
      expiryDate: bagPageConstants.defaultCard1Expiry,
      theme: bagPageConstants.themeBlack,
    },
    {
      id: bagPageConstants.defaultCard2Id,
      brand: bagPageConstants.brandVisa,
      last4: bagPageConstants.defaultCard2Last4,
      holderName: bagPageConstants.defaultCard2Holder,
      expiryDate: bagPageConstants.defaultCard2Expiry,
      theme: bagPageConstants.themeSilver,
    },
  ]);
  const [selectedCardId, setSelectedCardId] = useState<string>(bagPageConstants.defaultCard1Id);
  const [isAddCardOpen, setIsAddCardOpen] = useState<boolean>(false);
  const [newCardName, setNewCardName] = useState<string>(bagPageConstants.emptyString);
  const [newCardNumber, setNewCardNumber] = useState<string>(bagPageConstants.emptyString);
  const [newCardExpiry, setNewCardExpiry] = useState<string>(bagPageConstants.emptyString);
  const [newCardCvv, setNewCardCvv] = useState<string>(bagPageConstants.emptyString);
  const [isDefaultNewCard, setIsDefaultNewCard] = useState<boolean>(true);
  const [isTokenizing, setIsTokenizing] = useState<boolean>(false);
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: bagPageConstants.defaultShipName,
    addressLine: bagPageConstants.defaultShipAddress,
    city: bagPageConstants.defaultShipCity,
    state: bagPageConstants.defaultShipState,
    zipCode: bagPageConstants.defaultShipZip,
    country: bagPageConstants.defaultShipCountry,
  });
  const [addressDraft, setAddressDraft] = useState<ShippingDetails>({ ...shippingDetails });
  const activeCard = savedCards.find((c) => c.id === selectedCardId) || savedCards[0];
  const getCardBrand = (number: string): 'Visa' | 'Mastercard' | 'Unknown' => {
    const sanitized = number.replace(whitespaceRegex, '');
    if (visaRegex.test(sanitized)) return bagPageConstants.brandVisa;
    if (cardRegex.test(sanitized)) return bagPageConstants.brandMastercard;
    return bagPageConstants.brandUnknown;
  };
  const handleCardNumberChange = (text: string) => {
    const sanitized = text.replace(nonDigitsRegex, '');
    const matches = sanitized.match(digitsChunksRegex);
    const formatted = matches ? matches.join(' ') : '';
    setNewCardNumber(formatted.slice(0, 19));
  };
  const handleExpiryChange = (text: string) => {
    const sanitized = text.replace(nonDigitsRegex, '');
    if (sanitized.length >= 2) {
      setNewCardExpiry(sanitized.slice(0, 2) + '/' + sanitized.slice(2, 4));
    } else {
      setNewCardExpiry(sanitized);
    }
  };

  const handleSaveAddress = () => {
    setShippingDetails({ ...addressDraft });
    setIsEditingAddress(false);
    Toast.show({
      type: bagPageConstants.toastTypeSuccess,
      text1: bagPageConstants.toastAddressUpdated,
      text2: bagPageConstants.toastAddressSaved,
    });
  };
  const handleAddCard = async () => {
    const sanitizedCard = newCardNumber.replace(whitespaceRegex, '');
    if (!newCardName.trim() || !cardNameRegex.test(newCardName)) {
      Toast.show({ type: bagPageConstants.toastTypeError, text1: bagPageConstants.errorValidationName });
      return;
    }
    if (!creditCardNumberRegex.test(sanitizedCard)) {
      Toast.show({ type: bagPageConstants.toastTypeError, text1: bagPageConstants.errorValidationCardNumber });
      return;
    }
    if (!cardExpiryRegex.test(newCardExpiry)) {
      Toast.show({ type: bagPageConstants.toastTypeError, text1: bagPageConstants.errorValidationExpiry });
      return;
    }
    if (!cardCvvRegex.test(newCardCvv)) {
      Toast.show({ type: bagPageConstants.toastTypeError, text1: bagPageConstants.errorValidationCvv });
      return;
    }

    try {
      setIsTokenizing(true);
      Toast.show({
        type: bagPageConstants.toastTypeInfo,
        text1: bagPageConstants.toastTokenizingCard,
        text2: bagPageConstants.toastSecuringStripe,
      });
      const [expMonth, expYear] = newCardExpiry.split('/');
      const formattedYear = '20' + expYear;
      let cardId = '';
      let brand: 'Visa' | 'Mastercard' | 'Unknown' = bagPageConstants.brandUnknown;
      let last4 = sanitizedCard.slice(-4);

      try {
        const params = {
          paymentMethodType: 'Card',
          paymentMethodData: {
            card: {
              number: sanitizedCard,
              expMonth: parseInt(expMonth),
              expYear: parseInt(formattedYear),
              cvc: newCardCvv,
            },
            billingDetails: {
              name: newCardName,
            }
          }
        };
        const tokenResult = (await createPaymentMethod(
          params as unknown as Parameters<ReturnType<typeof useStripe>['createPaymentMethod']>[0]
        )) as unknown as { paymentMethod?: { id?: string; card?: { brand?: string; last4?: string } }; error?: { message: string } };

        if (tokenResult.error) {
          throw new Error(tokenResult.error.message);
        }

        const stripeCard = tokenResult.paymentMethod?.card;
        const stripeBrand = tokenResult.paymentMethod?.card?.brand;

        if (stripeBrand?.toLowerCase() === bagPageConstants.brandVisaLc) brand = bagPageConstants.brandVisa;
        else if (stripeBrand?.toLowerCase() === bagPageConstants.brandMastercardLc) brand = bagPageConstants.brandMastercard;
        else brand = getCardBrand(sanitizedCard);

        cardId = tokenResult.paymentMethod?.id || `${bagPageConstants.stripeCustomPrefix}_${Date.now()}`;
        last4 = stripeCard?.last4 || sanitizedCard.slice(-4);
      } catch (tokenErr) {
        brand = getCardBrand(sanitizedCard);
        cardId = `${bagPageConstants.stripeMockPrefix}_${Date.now()}`;
        last4 = sanitizedCard.slice(-4);
      }

      const themeOptions: (typeof bagPageConstants.themeBlack | typeof bagPageConstants.themeSilver | typeof bagPageConstants.themePurple)[] = [
        bagPageConstants.themeBlack,
        bagPageConstants.themeSilver,
        bagPageConstants.themePurple
      ];
      const randomTheme = themeOptions[savedCards.length % themeOptions.length];

      const newCardObj: SavedCard = {
        id: cardId,
        brand,
        last4,
        holderName: newCardName,
        expiryDate: newCardExpiry,
        theme: randomTheme,
      };

      setSavedCards([...savedCards, newCardObj]);

      if (isDefaultNewCard) {
        setSelectedCardId(cardId);
      }

      Toast.show({
        type: bagPageConstants.toastTypeSuccess,
        text1: bagPageConstants.toastCardAdded,
        text2: `Added ${brand} ending in ${last4} (${cardId.startsWith(bagPageConstants.stripeMockPrefix) ? bagPageConstants.offlineModeLabel : bagPageConstants.securedLabel}).`,
      });
      setNewCardName(bagPageConstants.emptyString);
      setNewCardNumber(bagPageConstants.emptyString);
      setNewCardExpiry(bagPageConstants.emptyString);
      setNewCardCvv(bagPageConstants.emptyString);
      setIsAddCardOpen(false);
    } catch (err) {
      const error = err as Error;
      Toast.show({
        type: bagPageConstants.toastTypeError,
        text1: bagPageConstants.errorCardAdditionTitle,
        text2: error.message || bagPageConstants.errorCardAdditionDetail
      });
    } finally {
      setIsTokenizing(false);
    }
  };
  const handleSubmitOrder = async () => {
    try {
      setIsProcessingPayment(true);
      Toast.show({
        type: bagPageConstants.toastTypeInfo,
        text1: bagPageConstants.toastCreatingOrder,
        text2: bagPageConstants.toastPreparingPayment,
      });

      const finalPrice = totalAmount + courierFees[deliveryMethod];
      const amountInPaise = Math.round(finalPrice * 100);
      const response = await createPaymentApi({
        amount: amountInPaise,
        currency: bagPageConstants.currencyUsd,
        paymentMethod: activeCard.id.startsWith(bagPageConstants.stripePmPrefix) ? activeCard.id : bagPageConstants.testVisaPaymentMethod,
      });

      const clientSecret = response.clientSecret || response.client_secret || response.data?.clientSecret || response.data?.client_secret;
      const intentId = response.payment_id || response.paymentIntent || response.id || response.data?.paymentIntent || response.data?.id;

      if (!clientSecret) {
        throw new Error(bagPageConstants.errorClientSecret);
      }

      const isMockCard = activeCard.id === bagPageConstants.defaultCard1Id || activeCard.id === bagPageConstants.defaultCard2Id || activeCard.id.startsWith(bagPageConstants.stripeMockPrefix) || activeCard.id.startsWith(bagPageConstants.stripeCustomPrefix);

      if (isMockCard) {
        Toast.show({
          type: bagPageConstants.toastTypeInfo,
          text1: bagPageConstants.toastProcessingGateway,
          text2: bagPageConstants.toastConfirmingMock,
        });

        await new Promise<void>((resolve) => setTimeout(() => resolve(), 1200));

        Toast.show({
          type: bagPageConstants.toastTypeSuccess,
          text1: bagPageConstants.toastPaymentAuthorized,
          text2: bagPageConstants.toastBypassedSDK,
        });
      } else {
        Toast.show({
          type: bagPageConstants.toastTypeInfo,
          text1: bagPageConstants.toastProcessingGateway,
          text2: bagPageConstants.toastConfirmingPayment,
        });
        const confirmResult = await confirmPayment(clientSecret, {
          paymentMethodType: 'Card',
          paymentMethodData: {
            billingDetails: {
              name: activeCard.holderName,
              address: {
                line1: shippingDetails.addressLine,
                city: shippingDetails.city,
                state: shippingDetails.state,
                postalCode: shippingDetails.zipCode,
                country: bagPageConstants.countryUsCode,
              }
            }
          }
        });

        if (confirmResult.error) {
          if (confirmResult.error.code === bagPageConstants.confirmResultCancelCode) {
            Toast.show({
              type: bagPageConstants.toastTypeInfo,
              text1: bagPageConstants.toastPaymentCancelled,
              text2: bagPageConstants.toastCancelledDetail,
            });
          } else {
            Toast.show({
              type: bagPageConstants.toastTypeError,
              text1: bagPageConstants.toastAuthFailed,
              text2: confirmResult.error.message,
            });
          }
          setIsProcessingPayment(false);
          return;
        }
      }
      Toast.show({
        type: bagPageConstants.toastTypeInfo,
        text1: bagPageConstants.toastVerifyingTransaction,
        text2: bagPageConstants.toastCheckingStatus,
      });

      const verifyResponse = await verifyPaymentApi({
        payment_id: intentId,
      });

      if (
        verifyResponse.status === 'Success' ||
        verifyResponse.statusCode === 200 ||
        verifyResponse.data?.status === 'succeeded' ||
        verifyResponse.success
      ) {
        Toast.show({
          type: bagPageConstants.toastTypeSuccess,
          text1: bagPageConstants.toastOrderSuccessful,
          text2: bagPageConstants.toastOrderPlaced,
        });
        await fetchCart();
        setTimeout(() => {
          navigation.navigate(bagPageConstants.successScreenRoute);
        }, 1500);
      } else {
        throw new Error(verifyResponse.message || bagPageConstants.errorVerificationRejected);
      }
    } catch (err) {
      const error = err as Error;
      Toast.show({
        type: bagPageConstants.toastTypeError,
        text1: bagPageConstants.errorOrderProcessingTitle,
        text2: error.message || bagPageConstants.errorFinalizingOrder,
      });
      setIsProcessingPayment(false);
    }
  };

  const deliveryPrice = courierFees[deliveryMethod];
  const grandTotal = totalAmount + deliveryPrice;

  return (
    <SafeAreaView style={paymentMethodScreenStyles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {currentView === bagPageConstants.checkoutViewMode ? (
        <View style={paymentMethodScreenStyles.flexOne}>
          <View style={paymentMethodScreenStyles.header}>
            <TouchableOpacity
              style={paymentMethodScreenStyles.backButton}
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
            >
              <BackIcon stroke={colors.black} />
            </TouchableOpacity>
            <Text style={paymentMethodScreenStyles.headerTitle}>{bagPageConstants.checkoutTitle}</Text>
            <View style={paymentMethodScreenStyles.placeholder} />
          </View>

          <ScrollView contentContainerStyle={paymentMethodScreenStyles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={paymentMethodScreenStyles.sectionHeaderRow}>
              <Text style={paymentMethodScreenStyles.sectionTitle}>{bagPageConstants.shippingAddressTitle}</Text>
              {!isEditingAddress && (
                <TouchableOpacity activeOpacity={0.7} onPress={() => setIsEditingAddress(true)}>
                  <Text style={paymentMethodScreenStyles.editButtonText}>{bagPageConstants.changeBtn}</Text>
                </TouchableOpacity>
              )}
            </View>

            {isEditingAddress ? (
              <View style={[paymentMethodScreenStyles.card, paymentMethodScreenStyles.editCard]}>
                <BaseTextInput
                  label={loginPageConstants.name}
                  value={addressDraft.fullName}
                  onChangeText={(val) => setAddressDraft({ ...addressDraft, fullName: val })}
                />
                <BaseTextInput
                  label={signUpPageConstants.address}
                  value={addressDraft.addressLine}
                  onChangeText={(val) => setAddressDraft({ ...addressDraft, addressLine: val })}
                />
                <View style={paymentMethodScreenStyles.inputRow}>
                  <View style={paymentMethodScreenStyles.flexHalf}>
                    <BaseTextInput
                      label={signUpPageConstants.city}
                      value={addressDraft.city}
                      onChangeText={(val) => setAddressDraft({ ...addressDraft, city: val })}
                    />
                  </View>
                  <View style={paymentMethodScreenStyles.flexHalf}>
                    <BaseTextInput
                      label={signUpPageConstants.state}
                      value={addressDraft.state}
                      onChangeText={(val) => setAddressDraft({ ...addressDraft, state: val })}
                    />
                  </View>
                </View>
                <View style={paymentMethodScreenStyles.inputRow}>
                  <View style={paymentMethodScreenStyles.flexHalf}>
                    <BaseTextInput
                      label={signUpPageConstants.postalCode}
                      value={addressDraft.zipCode}
                      keyboardType="numeric"
                      onChangeText={(val) => setAddressDraft({ ...addressDraft, zipCode: val })}
                    />
                  </View>
                  <View style={paymentMethodScreenStyles.flexHalf}>
                    <BaseTextInput
                      label={signUpPageConstants.country}
                      value={addressDraft.country}
                      onChangeText={(val) => setAddressDraft({ ...addressDraft, country: val })}
                    />
                  </View>
                </View>
                <View style={paymentMethodScreenStyles.editActionsRow}>
                  <TouchableOpacity
                    style={[paymentMethodScreenStyles.actionBtn, paymentMethodScreenStyles.cancelBtn]}
                    onPress={() => {
                      setAddressDraft({ ...shippingDetails });
                      setIsEditingAddress(false);
                    }}
                  >
                    <Text style={paymentMethodScreenStyles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[paymentMethodScreenStyles.actionBtn, paymentMethodScreenStyles.saveBtn]}
                    onPress={handleSaveAddress}
                  >
                    <Text style={paymentMethodScreenStyles.saveBtnText}>{bagPageConstants.saveBtnLabel}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={paymentMethodScreenStyles.card}>
                <View style={paymentMethodScreenStyles.addressCardContent}>
                  <Text style={paymentMethodScreenStyles.customerName}>{shippingDetails.fullName}</Text>
                  <Text style={paymentMethodScreenStyles.addressLine}>
                    {shippingDetails.addressLine}{'\n'}
                    {shippingDetails.city}, {shippingDetails.state} {shippingDetails.zipCode}, {shippingDetails.country}
                  </Text>
                </View>
              </View>
            )}

            <View style={paymentMethodScreenStyles.sectionHeaderRow}>
              <Text style={paymentMethodScreenStyles.sectionTitle}>{bagPageConstants.paymentTitle}</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setCurrentView('saved_cards')}>
                <Text style={paymentMethodScreenStyles.editButtonText}>{bagPageConstants.changeBtn}</Text>
              </TouchableOpacity>
            </View>

            <View style={paymentMethodScreenStyles.card}>
              <View style={paymentMethodScreenStyles.paymentSelectionRow}>
                {activeCard.brand === 'Visa' ? (
                  <View style={[paymentMethodScreenStyles.brandBadge, paymentMethodScreenStyles.visaBadge]}>
                    <Text style={paymentMethodScreenStyles.visaBadgeText}>VISA</Text>
                  </View>
                ) : (
                  <View style={[paymentMethodScreenStyles.brandBadge, paymentMethodScreenStyles.mcBadge]}>
                    <View style={paymentMethodScreenStyles.mcCircleLeft} />
                    <View style={paymentMethodScreenStyles.mcCircleRight} />
                  </View>
                )}
                <Text style={paymentMethodScreenStyles.selectedCardMask}>
                  {bagPageConstants.cardNumberMask}{activeCard.last4}
                </Text>
              </View>
            </View>
            <Text style={paymentMethodScreenStyles.sectionTitle}>{bagPageConstants.deliveryMethodTitle}</Text>
            <View style={paymentMethodScreenStyles.deliveryRow}>
              <TouchableOpacity
                style={[paymentMethodScreenStyles.deliveryCard, deliveryMethod === bagPageConstants.courierFedex && paymentMethodScreenStyles.activeDeliveryCard]}
                activeOpacity={0.8}
                onPress={() => setDeliveryMethod(bagPageConstants.courierFedex)}
              >
                <View style={paymentMethodScreenStyles.courierLogoContainer}>
                  <Text style={[paymentMethodScreenStyles.courierText, { color: colors.orange, fontWeight: '800' }]}>
                    {bagPageConstants.courierFedexLabel}
                  </Text>
                </View>
                <Text style={paymentMethodScreenStyles.deliveryTimeText}>{bagPageConstants.deliveryTimeLabel}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[paymentMethodScreenStyles.deliveryCard, deliveryMethod === bagPageConstants.courierUsps && paymentMethodScreenStyles.activeDeliveryCard]}
                activeOpacity={0.8}
                onPress={() => setDeliveryMethod(bagPageConstants.courierUsps)}
              >
                <View style={paymentMethodScreenStyles.courierLogoContainer}>
                  <Text style={[paymentMethodScreenStyles.courierText, { color: colors.blue, fontWeight: '800', fontStyle: 'italic' }]}>
                    {bagPageConstants.courierUspsLabel}
                  </Text>
                </View>
                <Text style={paymentMethodScreenStyles.deliveryTimeText}>{bagPageConstants.deliveryTimeLabel}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[paymentMethodScreenStyles.deliveryCard, deliveryMethod === bagPageConstants.courierDhl && paymentMethodScreenStyles.activeDeliveryCard]}
                activeOpacity={0.8}
                onPress={() => setDeliveryMethod(bagPageConstants.courierDhl)}
              >
                <View style={paymentMethodScreenStyles.courierLogoContainer}>
                  <Text style={[paymentMethodScreenStyles.courierText, { color: colors.yellow, fontWeight: '900' }]}>
                    {bagPageConstants.courierDhlLabel}
                  </Text>
                </View>
                <Text style={paymentMethodScreenStyles.deliveryTimeText}>{bagPageConstants.deliveryTimeLabel}</Text>
              </TouchableOpacity>
            </View>
            <View style={paymentMethodScreenStyles.calcContainer}>
              <View style={paymentMethodScreenStyles.calcRow}>
                <Text style={paymentMethodScreenStyles.calcLabel}>{bagPageConstants.orderLabel}</Text>
                <Text style={paymentMethodScreenStyles.calcValue}>{totalAmount}{bagPageConstants.currencySymbol}</Text>
              </View>
              <View style={paymentMethodScreenStyles.calcRow}>
                <Text style={paymentMethodScreenStyles.calcLabel}>{bagPageConstants.deliveryLabel}</Text>
                <Text style={paymentMethodScreenStyles.calcValue}>{deliveryPrice}{bagPageConstants.currencySymbol}</Text>
              </View>
              <View style={[paymentMethodScreenStyles.calcRow, { marginTop: 14 }]}>
                <Text style={paymentMethodScreenStyles.summaryLabelText}>{bagPageConstants.summaryLabel}</Text>
                <Text style={paymentMethodScreenStyles.summaryValueText}>{grandTotal}{bagPageConstants.currencySymbol}</Text>
              </View>
            </View>

            {/* Submit Button */}
            <BaseButton
              title={isProcessingPayment ? 'PROCESSING...' : bagPageConstants.submitOrderBtn}
              variant="primary"
              fullWidth
              isLoading={isProcessingPayment}
              containerStyle={paymentMethodScreenStyles.submitOrderBtn}
              onPress={handleSubmitOrder}
            />
          </ScrollView>
        </View>
      ) : (
        <View style={paymentMethodScreenStyles.flexOne}>
          <View style={paymentMethodScreenStyles.header}>
            <TouchableOpacity
              style={paymentMethodScreenStyles.backButton}
              activeOpacity={0.7}
              onPress={() => setCurrentView(bagPageConstants.checkoutViewMode)}
            >
              <BackIcon stroke={colors.black} />
            </TouchableOpacity>
            <Text style={paymentMethodScreenStyles.headerTitle}>{bagPageConstants.paymentMethodsTitle}</Text>
            <View style={paymentMethodScreenStyles.placeholder} />
          </View>

          <View style={paymentMethodScreenStyles.flexOne}>
            <ScrollView contentContainerStyle={paymentMethodScreenStyles.savedCardsScroll} showsVerticalScrollIndicator={false}>
              <Text style={paymentMethodScreenStyles.sectionTitle}>{bagPageConstants.yourPaymentCardsTitle}</Text>

              {savedCards.map((card) => {
                const isSelected = card.id === selectedCardId;
                const cardStyle =
                  card.theme === bagPageConstants.themeBlack ? paymentMethodScreenStyles.blackCard :
                    card.theme === bagPageConstants.themeSilver ? paymentMethodScreenStyles.silverCard :
                      paymentMethodScreenStyles.purpleCard;

                return (
                  <View key={card.id} style={paymentMethodScreenStyles.cardContainer}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      style={[paymentMethodScreenStyles.visualCard, cardStyle]}
                      onPress={() => setSelectedCardId(card.id)}
                    >
                      <View style={paymentMethodScreenStyles.goldChip} />
                      <Text style={[paymentMethodScreenStyles.visualCardMask, card.theme === bagPageConstants.themeSilver && paymentMethodScreenStyles.darkText]}>
                        {bagPageConstants.cardNumberMask}{card.last4}
                      </Text>
                      <View style={paymentMethodScreenStyles.cardLogoPosition}>
                        {card.brand === bagPageConstants.brandVisa ? (
                          <Text style={[paymentMethodScreenStyles.cardBrandLogoText, card.theme === bagPageConstants.themeSilver && paymentMethodScreenStyles.visaBlueText]}>{bagPageConstants.brandVisa.toUpperCase()}</Text>
                        ) : (
                          <View style={paymentMethodScreenStyles.cardBrandMcLogo}>
                            <View style={paymentMethodScreenStyles.mcCircleLeft} />
                            <View style={paymentMethodScreenStyles.mcCircleRight} />
                          </View>
                        )}
                      </View>
                      <View style={paymentMethodScreenStyles.cardFooterRow}>
                        <View>
                          <Text style={[paymentMethodScreenStyles.visualCardLabel, card.theme === bagPageConstants.themeSilver && paymentMethodScreenStyles.grayLabel]}>{bagPageConstants.cardHolderNameLabel}</Text>
                          <Text style={[paymentMethodScreenStyles.visualCardValue, card.theme === bagPageConstants.themeSilver && paymentMethodScreenStyles.darkText]}>{card.holderName}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={[paymentMethodScreenStyles.visualCardLabel, card.theme === bagPageConstants.themeSilver && paymentMethodScreenStyles.grayLabel]}>{bagPageConstants.expireDateLabel}</Text>
                          <Text style={[paymentMethodScreenStyles.visualCardValue, card.theme === bagPageConstants.themeSilver && paymentMethodScreenStyles.darkText]}>{card.expiryDate}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={paymentMethodScreenStyles.checkboxRow}
                      activeOpacity={0.7}
                      onPress={() => setSelectedCardId(card.id)}
                    >
                      <View style={[paymentMethodScreenStyles.customCheckSquare, isSelected && paymentMethodScreenStyles.activeCustomCheckSquare]}>
                        {isSelected && <CheckIcon width={10} height={10} color={colors.white} />}
                      </View>
                      <Text style={paymentMethodScreenStyles.checkboxLabel}>{bagPageConstants.useDefaultCheckboxLabel}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={paymentMethodScreenStyles.fabButton}
              activeOpacity={0.8}
              onPress={() => setIsAddCardOpen(true)}
            >
              <Text style={paymentMethodScreenStyles.fabIconText}>{bagPageConstants.plusSymbol}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Modal
        visible={isAddCardOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddCardOpen(false)}
      >
        <View style={paymentMethodScreenStyles.modalOverlay}>
          <TouchableOpacity
            style={paymentMethodScreenStyles.dismissOverlay}
            activeOpacity={1}
            onPress={() => setIsAddCardOpen(false)}
          />

          <View style={paymentMethodScreenStyles.addCardDrawer}>
            <View style={paymentMethodScreenStyles.drawerHandle} />

            <Text style={paymentMethodScreenStyles.drawerTitle}>{bagPageConstants.addNewCardTitle}</Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={paymentMethodScreenStyles.drawerScroll}>
              <BaseTextInput
                label={bagPageConstants.nameOnCardLabel}
                value={newCardName}
                onChangeText={setNewCardName}
              />

              <View style={paymentMethodScreenStyles.relativeInputContainer}>
                <BaseTextInput
                  label={bagPageConstants.cardNumberLabel}
                  keyboardType="numeric"
                  value={newCardNumber}
                  onChangeText={handleCardNumberChange}
                />
                <View style={paymentMethodScreenStyles.brandIconInputPosition}>
                  {getCardBrand(newCardNumber) === bagPageConstants.brandVisa ? (
                    <View style={paymentMethodScreenStyles.visaSmallBadge}>
                      <Text style={paymentMethodScreenStyles.visaSmallText}>{bagPageConstants.brandVisa.toUpperCase()}</Text>
                    </View>
                  ) : getCardBrand(newCardNumber) === bagPageConstants.brandMastercard ? (
                    <View style={paymentMethodScreenStyles.mcSmallBadge}>
                      <View style={paymentMethodScreenStyles.mcCircleLeft} />
                      <View style={paymentMethodScreenStyles.mcCircleRight} />
                    </View>
                  ) : null}
                </View>
              </View>

              <BaseTextInput
                label={bagPageConstants.expireDateLabel}
                keyboardType="numeric"
                value={newCardExpiry}
                onChangeText={handleExpiryChange}
              />

              <BaseTextInput
                label={bagPageConstants.cvvLabel}
                keyboardType="numeric"
                secureTextEntry={true}
                value={newCardCvv}
                maxLength={4}
                onChangeText={setNewCardCvv}
              />
              <TouchableOpacity
                style={[paymentMethodScreenStyles.checkboxRow, { marginTop: 8, marginBottom: 24 }]}
                activeOpacity={0.7}
                onPress={() => setIsDefaultNewCard(!isDefaultNewCard)}
              >
                <View style={[paymentMethodScreenStyles.customCheckSquare, isDefaultNewCard && paymentMethodScreenStyles.activeCustomCheckSquare]}>
                  {isDefaultNewCard && <CheckIcon width={10} height={10} color={colors.white} />}
                </View>
                <Text style={paymentMethodScreenStyles.checkboxLabel}>{bagPageConstants.setDefaultCheckboxLabel}</Text>
              </TouchableOpacity>
              <BaseButton
                title={isTokenizing ? bagPageConstants.securingCardBtnLabel : bagPageConstants.addCardBtn}
                variant="primary"
                fullWidth
                isLoading={isTokenizing}
                containerStyle={paymentMethodScreenStyles.addCardBtn}
                onPress={handleAddCard}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PaymentMethodsScreen;
