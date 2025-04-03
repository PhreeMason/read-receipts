import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import tw from 'twrnc';

const AddToLibraryButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={tw`bg-gray-800 rounded-lg py-3 px-4 mt-6`}
      onPress={onPress}
    >
      <Text style={tw`text-white text-center font-medium`}>Add to Library</Text>
    </TouchableOpacity>
  );
};

export default AddToLibraryButton;