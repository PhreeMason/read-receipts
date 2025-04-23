import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import tw from 'twrnc';
import { useGetBooksByStatus } from '@/hooks/useBooks';
import { Loading } from '@/components/shared/Loading';
import { router } from 'expo-router';

const CurrentlyReading = () => {
    const { data: readingBooks, isLoading } = useGetBooksByStatus('current');
  
    const handleSeeAll = () => {
      router.push('/(tabs)/library');
    };
  
    const handleBookPress = (bookId: string) => {
      router.push(`/book/${bookId}/dispay`);
    };

    console.log({readingBooks})
    return null;
    return (
      <View style={tw`mb-6`}>
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <Text style={tw`font-semibold text-black text-lg`}>Currently Reading</Text>
          <TouchableOpacity onPress={handleSeeAll}>
            <Text style={tw`text-sm text-gray-600`}>See all</Text>
          </TouchableOpacity>
        </View>
  
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`overflow-visible`}
          contentContainerStyle={tw`space-x-4 pb-2`}
        >
          {isLoading ? (
            <Text>Loading...</Text>
          ) : (
            readingBooks?.map((book) => (
              <TouchableOpacity 
                key={book.id}
                style={tw`w-36 flex-shrink-0`}
                onPress={() => handleBookPress(book.id)}
              >
                <View style={tw`h-full flex flex-col rounded-lg shadow-sm bg-white`}>
                  <View style={tw`relative`}>
                    <View style={tw`w-full h-48 overflow-hidden rounded-t-lg`}>
                      <Text>cover</Text>
                    </View>
                  </View>
                  <View style={tw`p-3 flex-1 flex flex-col`}>
                    <Text style={tw`font-medium text-black mb-1`} numberOfLines={1}>{book.title}</Text>
                    <Text style={tw`text-xs text-gray-600 mb-1`}>{book.author}</Text>
                    
                    <View style={tw`mt-auto`}>
                      <View style={tw`w-full bg-gray-200 rounded-full h-1 mb-2`}>
                        <View 
                          style={[
                            tw`bg-gray-800 h-1 rounded-full`, 
                            { width: `${book.progress || 0}%` }
                          ]} 
                        />
                      </View>
                      <Text style={tw`text-xs text-gray-600 mb-1`}>{book.progress || 0}% complete</Text>
                      <Text style={tw`text-xs text-gray-600`}>{book.lastUpdated}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    );
  };
  
  export default CurrentlyReading;