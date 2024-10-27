import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';

const Eye = () => <Entypo name="eye" size={24} color="gray" />;
const EyeOff = () => <Entypo name="eye-with-line" size={24} color="gray" />;

interface PasswordFieldProps extends Omit<TextInputProps, 'className'> {
  error?: string;
  label?: string;
  helperText?: string;
}

export default function PasswordField({ 
  error,
  label = "Password",
  helperText,
  ...props 
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="space-y-2">
      <Text className="text-sm font-medium text-gray-700">{label}</Text>
      <View className="relative">
        <TextInput
          className={`p-4 border rounded-lg bg-white pr-12 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          secureTextEntry={!showPassword}
          {...props}
        />
        <TouchableOpacity 
          className="absolute right-4 top-4"
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff />
          ) : (
            <Eye />
          )}
        </TouchableOpacity>
      </View>
      {helperText && (
        <Text className="text-xs text-gray-500">{helperText}</Text>
      )}
      {error && (
        <Text className="text-sm text-red-500">{error}</Text>
      )}
    </View>
  );
}