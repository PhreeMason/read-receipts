import React from 'react';
import { View } from 'react-native';
import tw from 'twrnc';

interface ProgressBarProps {
  progress: number;
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
}

export function ProgressBar({
  progress,
  height = 4,
  backgroundColor = '#F3F4F6',
  fillColor = '#2563EB',
}: ProgressBarProps) {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <View style={[
      tw`rounded-full overflow-hidden`,
      { backgroundColor, height }
    ]}>
      <View
        style={[
          { backgroundColor: fillColor, width: `${clampedProgress}%`, height: '100%' },
          tw`rounded-full`
        ]}
      />
    </View>
  );
}