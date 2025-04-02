import { View, Text, TouchableOpacity, Image } from 'react-native'
import tw from 'twrnc'
import React from 'react'
import { useAuth } from '@/providers/AuthProvider';
// import FontAwesome from '@expo/vector-icons/FontAwesome';

const AvatarCircle = () => {
    const { profile } = useAuth();

    const { username, avatar_url } = profile || {};
    return (
        <TouchableOpacity style={tw`w-10 h-10 rounded-full bg-gray-200 overflow-hidden`}>
            {avatar_url ? (
                <Image source={{ uri: avatar_url }} style={tw`w-full h-full`} />
            ) : (
                <View style={tw`w-full h-full bg-gray-300 items-center justify-center`}>
                    <Text style={tw`text-gray-600 font-bold`}>
                        {username?.[0]?.toUpperCase() || username?.[0].toUpperCase() || 'RR'}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    )
}

export default AvatarCircle