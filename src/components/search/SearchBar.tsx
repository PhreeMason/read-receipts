// src/components/search/SearchBar.tsx
import React from 'react';
import { View, TextInput } from 'react-native';
import tw from 'twrnc';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText }) => {
  
  return (
    <View style={tw`px-4 py-2`}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search books..."
        placeholderTextColor={tw.color('gray-500')}
        style={tw`w-full p-3 rounded-lg bg-gray-100 text-gray-900 border-gray-200 border`}
      />
    </View>
  );
};