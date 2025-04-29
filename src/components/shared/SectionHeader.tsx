// components/shared/SectionHeader.jsx
import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from 'twrnc';

type SectionHeaderProps = {
    title: string;
    onSeeAllPress: (event: any) => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onSeeAllPress }) => {
    return (
        <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`font-semibold text-black text-lg`}>{title}</Text>
            <TouchableOpacity onPress={onSeeAllPress}>
                <Text style={tw`text-sm text-gray-600`}>See all</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SectionHeader;
