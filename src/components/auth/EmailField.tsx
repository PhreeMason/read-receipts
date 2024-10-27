import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import tw from 'twrnc';

interface EmailFieldProps extends Omit<TextInputProps, 'className'> {
  error?: string;
  label?: string;
}

export default function EmailField({ 
  error, 
  label = "Email",
  ...props 
}: EmailFieldProps) {
  return (
    <View style={tw`space-y-2`}>
      <Text style={tw`text-sm font-medium text-gray-700`}>{label}</Text>
      <TextInput
        style={tw`p-4 border rounded-lg bg-white ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder="Enter your email"
        autoCapitalize="none"
        keyboardType="email-address"
        {...props}
      />
      {error && (
        <Text style={tw`text-sm text-red-500`}>{error}</Text>
      )}
    </View>
  );
}