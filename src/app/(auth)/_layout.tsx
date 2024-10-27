import { useAuth } from '@/providers/AuthProvider';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthStackLayout() {
    const { session } = useAuth();

    if (session) {
        return <Redirect href="/(tabs)/" />;
    }

    return (
        <>
            <Stack />
            <StatusBar style="auto" />
        </>
    );
}