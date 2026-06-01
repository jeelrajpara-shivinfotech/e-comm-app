import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import { colors } from './src/theme';
import Toast from 'react-native-toast-message';
import { WishlistProvider } from './src/context/WishlistContext';
import { CartProvider } from './src/context/CartContext';
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <WishlistProvider>
        <CartProvider>
          <Navigation />
        </CartProvider>
      </WishlistProvider>
      <Toast />
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray
  },
});

export default App;
