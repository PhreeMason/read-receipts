// src/app/book/[id]/read.tsx
import { View, Text } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react'
import EpubReader from '@/components/reader/index';

const read = () => {
    const { id } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <EpubReader bookId={id as string} />
    </>
  )
}

export default read