import { Text, View } from 'react-native'
import React from 'react'
import AvatarCircle from '@/components/shared/AvatarCircle'
import tw from 'twrnc';

type HeaderProps = {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <View style={tw`flex justify-between items-center mb-6 flex-row`}>
            <Text style={tw`text-2xl font-bold text-black`}>{title}</Text>
            <AvatarCircle />
        </View>
    )
}

export default Header
