import React from 'react';
import { View, Text, TextInput } from 'react-native';
import tw from 'twrnc';

type AudioDurationProps = {
    hours: string;
    setHours: (value: string) => void;
    minutes: string;
    setMinutes: (value: string) => void;
}

const AudioDuration: React.FC<AudioDurationProps> = ({ hours, setHours, minutes, setMinutes }) => {
    return (
        <View style={tw`gap-4 mt-4`}>
            <Text style={tw`block text-sm font-medium text-gray-700 mb-1`}>Audiobook Total Time</Text>
            <View style={tw`flex flex-row gap-4`}>
                <View>
                    <Text style={tw`text-xs text-gray-500 mb-1`}>Hours</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg p-2`}
                        placeholder="0"
                        value={hours}
                        onChangeText={setHours}
                        keyboardType="numeric"
                    />
                </View>
                <View>
                    <Text style={tw`text-xs text-gray-500 mb-1`}>Minutes</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg p-2`}
                        placeholder="0"
                        value={minutes}
                        onChangeText={setMinutes}
                        keyboardType="numeric"
                    />
                </View>
            </View>
        </View>
    );
};

export default AudioDuration;