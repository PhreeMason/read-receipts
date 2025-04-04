import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

const FormatSelector = ({ format, setFormat }) => {
  return (
    <View>
      <Text style={tw`block text-sm font-medium text-gray-700 mb-1`}>Format *</Text>
      <View style={tw`flex flex-row gap-4 mt-1`}>
        <TouchableOpacity
          style={tw`${format === 'physical' ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-300'} border rounded-lg py-3 px-2 flex-grow`}
          onPress={() => setFormat('physical')}
        >
          <View style={tw`flex-col items-center`}>
            <Ionicons name="book-outline" size={16} color="#8C6A5B" style={tw`mb-1`} />
            <Text style={tw`text-sm font-medium text-center`}>Physical</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`${format === 'ebook' ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-300'} border rounded-lg py-3 px-2 flex-grow`}
          onPress={() => setFormat('ebook')}
        >
          <View style={tw`flex-col items-center`}>
            <Ionicons name="tablet-portrait-outline" size={16} color="#8C6A5B" style={tw`mb-1`} />
            <Text style={tw`text-sm font-medium text-center`}>E-Book</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`${format === 'audio' ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-300'} border rounded-lg py-3 px-2 flex-grow`}
          onPress={() => setFormat('audio')}
        >
          <View style={tw`flex-col items-center`}>
            <Ionicons name="headset-outline" size={16} color="#8C6A5B" style={tw`mb-1`} />
            <Text style={tw`text-sm font-medium text-center`}>Audio</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FormatSelector;