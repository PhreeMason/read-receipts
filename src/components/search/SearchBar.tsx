import React from 'react';
import { View, TextInput } from 'react-native';
import tw from 'twrnc';
import Svg, { Circle, Line } from 'react-native-svg';

type SearchBarProps = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
};

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    placeholder = 'Search by title, author, or ISBN',
}) => {
    return (
        <View style={tw`relative`}>
            {/* Input Field */}
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={tw.color('gray-500')}
                style={tw`py-3 pl-10 pr-12 w-full rounded-lg bg-gray-100 text-gray-900 border-gray-200 border`}
            />
            {/* Search Icon */}
            <View style={tw`absolute inset-y-0 right-0 pr-3 flex justify-center`}>
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8C6A5B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <Circle cx="11" cy="11" r="8" />
                    <Line x1="21" y1="21" x2="16.65" y2="16.65" />
                </Svg>
            </View>
        </View>
    );
};