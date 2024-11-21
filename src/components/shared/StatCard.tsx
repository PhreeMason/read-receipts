import { View, Text } from 'react-native'
import React from 'react'
import tw from 'twrnc';

const StatCard = ({ label, value }: { label: string, value: number | string }) => {
  return (
    <View style={tw`bg-gray-50 rounded-xl p-4 flex-1 mx-1`}>
      <Text style={tw`text-gray-600 text-sm`}>{label}</Text>
      <Text style={tw`text-gray-900 text-lg font-semibold mt-1`}>{value}</Text>
    </View>
  );
}

export default StatCard