import React, { useState } from 'react';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';
import { Link } from 'expo-router';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import tw from 'twrnc';

interface FormErrors {
  email?: string;
  password?: string;
  username?: string;
}

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: { email: string; password: string; username?: string }) => Promise<void>;
  isLoading?: boolean;
}

export default function AuthForm({ type, onSubmit, isLoading }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Username validation (only for register)
    if (type === 'register' && !username) {
      newErrors.username = 'Username is required';
    } else if (type === 'register' && username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (type === 'register' && !/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await onSubmit({
          email,
          password,
          ...(type === 'register' ? { username } : {}),
        });
      } catch (error) {
        // Handle submission errors
        setErrors({
          email: (error as Error).message,
        });
      }
    }
  };

  return (
    <View style={tw`space-y-4`}>
      {type === 'register' && (
        <View style={tw`space-y-2`}>
          <Text style={tw`text-sm font-medium text-gray-700`}>Username</Text>
          <TextInput
            style={tw.style(`p-4 border rounded-lg bg-white ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            }`)
            }
            placeholder="Choose a username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            maxLength={30}
          />
          {errors.username && (
            <Text style={tw`text-sm text-red-500`}>{errors.username}</Text>
          )}
        </View>
      )}

      <EmailField
        value={email}
        onChangeText={setEmail}
        error={errors.email}
      />

      <PasswordField
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        helperText={type === 'register' ? "Password must be at least 6 characters" : undefined}
      />

      <TouchableOpacity
        style={tw`bg-blue-600 p-4 rounded-lg mt-4`}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={tw`text-white text-center font-semibold`}>
          {isLoading
            ? type === 'login' ? 'Signing in...' : 'Creating Account...'
            : type === 'login' ? 'Sign In' : 'Create Account'
          }
        </Text>
      </TouchableOpacity>

      <View style={tw`flex-row justify-center space-x-1`}>
        <Text style={tw`text-gray-500`}>
          {type === 'login' ? "Don't have an account?" : "Already have an account?"}
        </Text>
        <Link
          href={type === 'login' ? '/sign-up' : '/login'}
          style={tw`text-blue-600 font-semibold`}
        >
          {type === 'login' ? 'Sign up' : 'Sign in'}
        </Link>
      </View>
    </View>
  );
}