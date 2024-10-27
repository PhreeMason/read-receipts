import React from 'react';
import { View, Text } from 'react-native';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View className="space-y-2">
      <Text className="text-3xl font-bold text-center">{title}</Text>
      <Text className="text-center text-gray-500">
        {subtitle}
      </Text>
    </View>
  );
}