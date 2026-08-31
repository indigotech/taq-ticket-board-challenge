import { Cinzel_600SemiBold } from '@expo-google-fonts/cinzel/600SemiBold';
import { Cinzel_700Bold } from '@expo-google-fonts/cinzel/700Bold';
import { EBGaramond_400Regular } from '@expo-google-fonts/eb-garamond/400Regular';
import { EBGaramond_400Regular_Italic } from '@expo-google-fonts/eb-garamond/400Regular_Italic';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TicketBoardScreen } from './src/screens/TicketBoardScreen/TicketBoardScreen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Cinzel_600SemiBold,
    Cinzel_700Bold,
    EBGaramond_400Regular,
    EBGaramond_400Regular_Italic,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {SplashScreen.hideAsync();}
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {return null;}

  return (
    <SafeAreaProvider>
      <TicketBoardScreen />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
