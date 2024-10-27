import React from 'react';
import { Image, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

interface AvatarImageProps {
  uri: string | null;
  size?: number;
}

export default function AvatarImage({ uri, size = 100 }: AvatarImageProps) {
  return (
    <View 
      style={{ width: size, height: size }}
      className="rounded-full overflow-hidden bg-gray-100 items-center justify-center"
    >
      {uri ? (
        <Image
          source={{ uri }}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <AntDesign name="camerao" size={24} color="gray" />
      )}
    </View>
  );
}