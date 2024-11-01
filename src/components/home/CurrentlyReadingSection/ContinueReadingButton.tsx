import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import tw from 'twrnc';

interface ContinueReadingButtonProps {
  onPress: () => void;
}

export function ContinueReadingButton({ onPress }: ContinueReadingButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`bg-blue-600 py-2 px-4 rounded-md mt-2`}
    >
      <Text style={tw`text-white text-center text-sm font-medium`}>
        Continue Reading
      </Text>
    </TouchableOpacity>
  );
}