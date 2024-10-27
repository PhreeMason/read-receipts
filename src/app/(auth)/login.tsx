import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signOut, signIn } = useAuth();

  const handleLogin = async () => {
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
    <View className="flex-1 justify-center px-4 bg-white">
      <View className="space-y-8">
        <View className="space-y-2">
          <Text className="text-3xl font-bold text-center">Welcome Back</Text>
          <Text className="text-center text-gray-500">
            Sign in to continue reading with your friends
          </Text>
        </View>

        <View className="space-y-4">
          <TextInput
            className="p-4 border border-gray-300 rounded-lg"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <TextInput
            className="p-4 border border-gray-300 rounded-lg"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            className="bg-blue-600 p-4 rounded-lg"
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-semibold">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center space-x-1">
          <Text className="text-gray-500">Don't have an account?</Text>
          <Link href="/register" className="text-blue-600 font-semibold">
            Sign up
          </Link>
        </View>
      </View>
    </View>
  );
}