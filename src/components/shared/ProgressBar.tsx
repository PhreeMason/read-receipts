import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';

interface ProgressBarProps {
  progress: number | null;
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
}

export function ProgressBar({
  progress,
  backgroundColor = '#E5E7EB',
  fillColor = '#2563EB',
}: ProgressBarProps) {
  if (progress === null || !progress) { return null }
  return (
    <>
      <View style={tw.style(
        `w-full h-2 rounded-full mt-2`,
        {
          backgroundColor
        })}>
        <View
          style={[
            tw.style(`h-2 bg-blue-600 rounded-full`, {
              backgroundColor: fillColor,
            }),
            { width: `${progress}%` }
          ]}
        />
      </View>
      <Text style={tw`text-gray-500 text-xs mt-1`}>
        {progress}% complete
      </Text>
    </>
  );
}