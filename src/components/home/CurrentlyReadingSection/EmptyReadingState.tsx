import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import tw from 'twrnc';

interface EmptyReadingStateProps {
  onPress: () => void;
}

export function EmptyReadingState({ onPress }: EmptyReadingStateProps) {
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`bg-gray-100 p-4 rounded-lg border border-gray-200`}
    >
      <Text style={tw`text-center 'text-gray-600`}>
        Ready to start a new book? Browse our library 📚
      </Text>
    </TouchableOpacity>
  );
}