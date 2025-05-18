import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import AuthProvider from '@/providers/AuthProvider';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import tw, { useDeviceContext } from 'twrnc';
import Toast from 'react-native-toast-message';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import * as Clipboard from "expo-clipboard";

dayjs.extend(relativeTime);
dayjs.extend(utc);
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient()
export default function RootLayout() {
    useDeviceContext(tw);
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    // Define your copy function based on your platform
    const onCopy = async (text: string) => {
        try {
            await Clipboard.setStringAsync(text);
            return true;
        } catch {
            return false;
        }
    };

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                </Stack>
            </QueryClientProvider>
            <Toast />
        </AuthProvider>
    );
}
