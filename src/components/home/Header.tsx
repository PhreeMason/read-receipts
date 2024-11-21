import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import tw from 'twrnc';

export default function HomeHeader() {
    const { profile } = useAuth();

    const { full_name, username, avatar_url } = profile || {};

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Morning';
        if (hour < 17) return 'Afternoon';
        return 'Evening';
    };

    return (
        <View style={tw`flex-row justify-between items-center px-4 pt-4`}>
          <View>
            <Text style={tw`text-gray-600 text-base`}>{greeting()}</Text>
            <Text style={tw`text-gray-900 text-xl font-semibold`}>{full_name || username || 'User'}</Text>
          </View>
          <TouchableOpacity>
            <Image
              source={{ uri: avatar_url || "https://picsum.photos/200" }}
              style={tw`w-10 h-10 rounded-full`}
            />
          </TouchableOpacity>
        </View>
    );
}