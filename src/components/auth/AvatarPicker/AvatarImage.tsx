import React from 'react';
import { Image, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import tw from 'twrnc';

interface AvatarImageProps {
  uri: string | null;
  size?: number;
}

export default function AvatarImage({ uri, size = 100 }: AvatarImageProps) {
  return (
    <View 
      style={tw.style(`rounded-full overflow-hidden bg-gray-100 items-center justify-center`, { width: size, height: size })}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={tw`w-full h-full`}
          resizeMode="cover"
        />
      ) : (
        <AntDesign name="camerao" size={24} color="gray" />
      )}
    </View>
  );
}