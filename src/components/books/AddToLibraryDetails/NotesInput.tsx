import React from 'react';
import { View, Text, TextInput } from 'react-native';
import tw from 'twrnc';

const NotesInput = ({ note, setNote }) => {
  return (
    <View>
      <Text style={tw`block text-sm font-medium text-gray-700 mb-1`}>Notes</Text>
      <TextInput
        style={tw`border border-gray-300 rounded-lg p-3 h-24`}
        placeholder="Add your notes about this book..."
        multiline
        value={note}
        onChangeText={setNote}
      />
    </View>
  );
};

export default NotesInput;