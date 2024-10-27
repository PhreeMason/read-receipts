import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View style={tw`space-y-2`}>
      <Text style={tw`text-3xl font-bold text-center`}>{title}</Text>
      <Text style={tw`text-center text-gray-500`}>
        {subtitle}
      </Text>
    </View>
  );
}