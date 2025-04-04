import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

const BookCover = ({ imageUrl }) => (
  <View style={tw`w-24 h-36 rounded-md overflow-hidden shadow-md`}>
    <Image
      source={{ uri: imageUrl }}
      style={tw`w-full h-full`}
      resizeMode="cover"
    />
  </View>
);

const StarRating = ({ rating }) => (
  <View style={tw`flex-row`}>
    {[...Array(Math.floor(rating))].map((_, i) => (
      <Ionicons key={i} name="star" size={14} color="#8C6A5B" />
    ))}
    {rating % 1 > 0 && <Ionicons name="star-half" size={14} color="#8C6A5B" />}
    {[...Array(5 - Math.ceil(rating))].map((_, i) => (
      <Ionicons key={i + Math.ceil(rating)} name="star-outline" size={14} color="#8C6A5B" />
    ))}
  </View>
);

const BookHeader = ({ book }) => {
  const [authorsExpanded, setAuthorsExpanded] = useState(false);
  
  const { title, cover_image_url, rating, rating_count, genres, total_pages, publication_date } = book;
  const authors = book.metadata?.authors || [];
  
  const toggleAuthorsExpanded = () => setAuthorsExpanded(!authorsExpanded);
  
  const displayedAuthors = authorsExpanded ? authors : authors.slice(0, 2);
  const shouldShowToggle = authors.length > 2;
  
  return (
    <View style={tw`flex-row space-x-4 mb-6`}>
      <View style={tw`flex-shrink-0`}>
        <BookCover imageUrl={cover_image_url} />
      </View>
      
      <View style={tw`flex-grow pl-2`}>
        <Text style={tw`font-bold text-lg text-black mb-1`}>{title}</Text>
        
        <View style={tw`flex-col mb-2`}>
          {displayedAuthors.map(name => (
            <Text style={tw`text-gray-600 text-sm`} key={name}>{name}</Text>
          ))}
          
          {shouldShowToggle && (
            <Text
              style={tw`text-gray-300 text-xs`}
              onPress={toggleAuthorsExpanded}
            >
              {authorsExpanded ? 'Show less' : 'Show more'}
            </Text>
          )}
        </View>
        
        <View style={tw`flex-row items-center mb-1`}>
          <StarRating rating={rating} />
          <Text style={tw`text-xs text-gray-500 ml-1`}>
            {rating} ({rating_count?.toLocaleString()} ratings)
          </Text>
        </View>
        
        <Text style={tw`text-xs text-gray-500 mb-1`}>
          {genres?.slice(0, 2).join(' • ')} • {total_pages} pages
        </Text>
        
        <Text style={tw`text-xs text-gray-500`}>
          Published {new Date(publication_date).toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
          })}
        </Text>
      </View>
    </View>
  );
};

export default BookHeader;