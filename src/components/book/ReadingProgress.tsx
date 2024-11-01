import { View, Text } from 'react-native';
import tw from 'twrnc';

export const ReadingProgress = ({ progress }: { progress: number }) => (
  <View style={tw`mt-4`}>
    <View style={tw`flex-row justify-between mb-2`}>
      <Text style={tw`text-gray-600 text-sm`}>Reading Progress</Text>
      <Text style={tw`text-gray-900 font-medium`}>{progress}%</Text>
    </View>
    <View style={tw`bg-gray-200 h-2 rounded-full`}>
      <View 
        style={tw.style(`bg-blue-500 h-2 rounded-full`, {width: `${progress}%`})}
      />
    </View>
  </View>
);