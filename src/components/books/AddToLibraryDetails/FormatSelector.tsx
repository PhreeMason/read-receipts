import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

type FormatSelectorProps = {
    formats: string[];
    setFormats: (format: string[]) => void;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({ formats, setFormats }) => {
    const toggleFormat = (format: string) => {
        if (formats.includes(format)) {
            // Remove format if already selected (but don't allow removing all formats)
            if (formats.length > 1) {
                setFormats(formats.filter(f => f !== format));
            }
        } else {
            // Add format if not already selected
            setFormats([...formats, format]);
        }
    };
    return (
        <View>
            <Text style={tw`block text-sm font-medium text-gray-700 mb-1`}>Format *</Text>
            <View style={tw`flex flex-row gap-4 mt-1`}>
                <TouchableOpacity
                    style={tw`${formats.includes('physical') ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-300'} border rounded-lg py-3 px-2 flex-grow`}
                    onPress={() => toggleFormat('physical')}
                >
                    <View style={tw`flex-col items-center`}>
                        <Ionicons name="book-outline" size={16} color="#8C6A5B" style={tw`mb-1`} />
                        <Text style={tw`text-sm font-medium text-center`}>Physical</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={tw`${formats.includes('ebook') ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-300'} border rounded-lg py-3 px-2 flex-grow`}
                    onPress={() => toggleFormat('ebook')}
                >
                    <View style={tw`flex-col items-center`}>
                        <Ionicons name="tablet-portrait-outline" size={16} color="#8C6A5B" style={tw`mb-1`} />
                        <Text style={tw`text-sm font-medium text-center`}>E-Book</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={tw`${formats.includes('audio') ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-300'} border rounded-lg py-3 px-2 flex-grow`}
                    onPress={() => toggleFormat('audio')}
                >
                    <View style={tw`flex-col items-center`}>
                        <Ionicons name="headset-outline" size={16} color="#8C6A5B" style={tw`mb-1`} />
                        <Text style={tw`text-sm font-medium text-center`}>Audio</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default FormatSelector;