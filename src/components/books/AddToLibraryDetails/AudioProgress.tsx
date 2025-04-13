import React from 'react';
import { View, Text, TextInput } from 'react-native';
import tw from 'twrnc';

type AudioProgressProps = {
    currentHours: string;
    setCurrentHours: (value: string) => void;
    currentMinutes: string;
    setCurrentMinutes: (value: string) => void;
}

const AudioProgress: React.FC<AudioProgressProps> = ({ currentHours, setCurrentHours, currentMinutes, setCurrentMinutes }) => {
    return (
        <View style={tw`gap-4 mt-4`}>
            <Text style={tw`block text-sm font-medium text-gray-700 mb-1`}>Current Audiobook Progress</Text>
            <View style={tw`flex flex-row gap-4`}>
                <View>
                    <Text style={tw`text-xs text-gray-500 mb-1`}>Hours</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg p-2`}
                        placeholder="0"
                        value={currentHours}
                        onChangeText={setCurrentHours}
                        keyboardType="numeric"
                    />
                </View>
                <View>
                    <Text style={tw`text-xs text-gray-500 mb-1`}>Minutes</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg p-2`}
                        placeholder="0"
                        value={currentMinutes}
                        onChangeText={setCurrentMinutes}
                        keyboardType="numeric"
                    />
                </View>
            </View>
        </View>
    );
};

export default AudioProgress;