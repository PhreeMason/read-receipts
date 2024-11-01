import { Text, View } from 'react-native';
import tw from 'twrnc';
import { BookStatus } from '@/types/book';

const statusColors = {
  'to-read': 'blue',
  'reading': 'green',
  'read': 'purple',
  'did-not-finish': 'gray'
};

export const BookStatusBadge = ({ status }: { status: BookStatus }) => (
  <View style={tw`bg-${statusColors[status]}-100 px-3 py-1 rounded-full`}>
    <Text style={tw`text-${statusColors[status]}-700 text-sm font-medium`}>
      {status.replace('-', ' ').toUpperCase()}
    </Text>
  </View>
);