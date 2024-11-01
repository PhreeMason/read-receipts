import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import tw from 'twrnc';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'small' | 'large';
}

export function Loading({ 
  message = "Loading your books...", 
  fullScreen = true,
  size = 'large'
}: LoadingProps) {
  
  // Base styles that will be used regardless of fullScreen prop
  const containerStyles = tw.style(
    'items-center justify-center space-y-4',
    'bg-gray-50',
    fullScreen && 'flex-1' // Only add flex-1 if fullScreen is true
  );

  // Dynamic text color based on theme
  const textColor = 'text-gray-600';
  
  return (
    <View style={containerStyles}>
      <ActivityIndicator 
        size={size}
        color={'#4B5563'} // gray-400 for dark, gray-600 for light
      />
      {message && (
        <Text style={tw`${textColor} text-sm font-medium text-center px-4`}>
          {message}
        </Text>
      )}
    </View>
  );
}

// Export common loading messages as constants
export const LoadingMessages = {
  BOOKS: "Loading your books...",
  ANNOTATIONS: "Loading annotations...",
  COMMENTS: "Loading comments...",
  PROFILE: "Loading profile...",
  LIBRARY: "Loading your library...",
  SYNC: "Syncing your progress..."
} as const;