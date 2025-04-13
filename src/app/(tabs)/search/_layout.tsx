import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

export default function Layout() {
    return (
        <SafeAreaView edges={['top']} style={tw`bg-white flex-1`}>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen
                    name="barcode-scan"
                    options={{
                        headerTitle: 'Scan Book Barcode',
                        presentation: 'modal',
                    }}
                />
            </Stack>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}
