import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import tw from 'twrnc';
import AntDesign from '@expo/vector-icons/AntDesign';
import AvatarCircle from '@/components/shared/AvatarCircle';

export default function HomeHeader() {
    const { profile } = useAuth();

    const { full_name, username } = profile || {};

    // Tuesday March 22
    const date = () => {
        const today = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const day = days[today.getDay()];
        const month = months[today.getMonth()];
        const date = today.getDate();

        return `${day}, ${month} ${date}`;
    }

    return (
        <View style={tw`flex-row justify-between items-center mb-8 mx-4`}>
            <View>
                <Text style={tw`text-2xl font-bold text-black`}>Hello, {full_name || username || 'Reader'}</Text>
                <Text style={tw`text-gray-600 text-sm`}>{date()}</Text>
            </View>
            <View style={tw`flex-row items-center gap-3`}>
                <TouchableOpacity style={tw`w-10 h-10 rounded-full items-center justify-center bg-gray-100 mr-4`}>
                    <AntDesign name="search1" size={24} color="black" />
                </TouchableOpacity>
                <AvatarCircle />
            </View>
        </View>
    );
}