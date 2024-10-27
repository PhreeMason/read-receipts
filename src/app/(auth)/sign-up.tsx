import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import AuthHeader from '../../components/auth/AuthHeader';
import AuthForm from '../../components/auth/AuthForm';
import AvatarPicker from '../../components/auth/AvatarPicker';
import tw from 'twrnc';

export default function SignUp() {
    const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>();

  const handleRegister = async (data: { email: string; password: string; username?: string }) => {
    setIsLoading(true);
    try {
      const { error } = await signUp(
        data.email,
        data.password,
        data.username || '',
        avatarUrl
      );
      
      if (error) throw error;

      Alert.alert(
        'Registration Successful',
        'Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarError = (error: Error) => {
    Alert.alert('Error', error.message);
  };

  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={tw`px-4 py-10 space-y-8`}>
        <AuthHeader
          title="Create Account"
          subtitle="Join our community of readers"
        />
        
        <View style={tw`items-center`}>
          <AvatarPicker
            onSuccess={setAvatarUrl}
            onError={handleAvatarError}
            size={120}
            disabled={isLoading}
          />
        </View>

        <AuthForm
          type="register"
          onSubmit={handleRegister}
          isLoading={isLoading}
        />
      </View>
    </ScrollView>
  );
}