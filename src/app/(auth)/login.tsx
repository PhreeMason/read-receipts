import React, { useState } from 'react';
import AuthHeader from '../../components/auth/AuthHeader';
import AuthForm from '../../components/auth/AuthForm';
import { useAuth } from '@/providers/AuthProvider';
import { Stack } from 'expo-router';
import { View, ScrollView, Alert } from 'react-native';
import tw from 'twrnc';

export default function LoginScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth();

    const handleLogin = async ({ email, password }: { email: string; password: string }) => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await signIn(email, password);
            if (error) throw error;
        } catch (error) {
            Alert.alert('Error', (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={tw`flex-1 bg-white`}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={tw`px-4 py-10 gap-8`}>
                <AuthHeader
                    title="Welcome Back"
                    subtitle="Sign in to continue reading with your friends"
                />
                <AuthForm
                    type="login"
                    onSubmit={handleLogin}
                    isLoading={isLoading}
                />
            </View>
        </ScrollView>
    );
}