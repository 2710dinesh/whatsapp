import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

import ChatApp from './index';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ChatApp />
    </SafeAreaProvider>
  );
}
