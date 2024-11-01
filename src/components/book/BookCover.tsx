import React from 'react';
import { Image } from 'react-native';
import tw from 'twrnc';

interface BookCoverProps {
  url?: string | null;
  className?: string;
}

export function BookCover({ url, className }: BookCoverProps) {
  return (
    <Image
      source={{ uri: url || '/api/placeholder/200/300' }}
      style={tw.style(`w-full h-40 bg-gray-200`, className)}
      resizeMode="cover"
    />
  );
}