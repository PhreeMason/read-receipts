// src/app/book/[id]/read.tsx
import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import React from 'react'
import EpubReader from '@/components/reader/EpubReader';

const read = () => {
    const { id } = useLocalSearchParams();

  return (
      <EpubReader bookId={id as string} />
  )
}

export default read