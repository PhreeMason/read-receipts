import { View, ScrollView } from 'react-native';
import BookUploadForm from '@/components/book/BookUploadForm';
import tw from 'twrnc';

export default function UploadBookModal() {
  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView>
        <BookUploadForm />
      </ScrollView>
    </View>
  );
}