import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import tw from 'twrnc';

export default function HomeHeader() {
  const { profile: user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  return (
    <View style={tw`px-4 pt-2 pb-4`}>
      {/* Header Row */}
      <View style={tw`flex-row justify-between items-center`}>
        {/* Greeting */}
        <View style={tw`space-y-1`}>
          <Text 
            style={tw.style(`text-lg font-medium text-gray-900`)}
          >
            {getGreeting()}, {user?.username ?? 'Reader'} 📚
          </Text>
          <Text style={tw`text-sm  text-gray-600`}>
            What's on your reading list today?
          </Text>
        </View>
      </View>
    </View>
  );
}