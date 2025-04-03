import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

const BookHeader = ({ book }) => {
  return (
    <View style={tw`flex-row space-x-4 mb-6`}>
      <View style={tw`flex-shrink-0`}>
        <View style={tw`w-24 h-36 rounded-md overflow-hidden shadow-md`}>
          <Image 
            source={{ uri: book.cover_image_url }} 
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
        </View>
      </View>
      <View style={tw`flex-grow pl-2`}>
        <Text style={tw`font-bold text-lg text-black mb-1`}>{book.title}</Text>
        <Text style={tw`text-gray-600 text-sm mb-2`}>{book.metadata?.authors?.join(', ')}</Text>
        <View style={tw`flex-row items-center mb-1`}>
          <View style={tw`flex-row`}>
            {[...Array(Math.floor(book.rating))].map((_, i) => (
              <Ionicons key={i} name="star" size={14} color="#8C6A5B" />
            ))}
            {book.rating % 1 > 0 && <Ionicons name="star-half" size={14} color="#8C6A5B" />}
            {[...Array(5 - Math.ceil(book.rating))].map((_, i) => (
              <Ionicons key={i + Math.ceil(book.rating)} name="star-outline" size={14} color="#8C6A5B" />
            ))}
          </View>
          <Text style={tw`text-xs text-gray-500 ml-1`}>{book.rating} ({book.rating_count?.toLocaleString()} ratings)</Text>
        </View>
        <Text style={tw`text-xs text-gray-500 mb-1`}>
          {book.genres?.slice(0, 2).join(' • ')} • {book.total_pages} pages
        </Text>
        <Text style={tw`text-xs text-gray-500`}>
          Published {new Date(book.publication_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
      </View>
    </View>
  );
};

export default BookHeader;