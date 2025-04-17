import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Controller } from 'react-hook-form';
import tw from 'twrnc';

type AudioProgressProps = {
    control: any;
    errors: any;
}

const AudioProgress: React.FC<AudioProgressProps> = ({ control, errors }) => {
    return (
        <View style={tw`gap-4 mt-4`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Current Audiobook Progress</Text>
            <View style={tw`flex flex-row gap-4`}>
                <View>
                    <Text style={tw`text-xs text-gray-500 mb-1`}>Hours</Text>
                    <Controller
                        control={control}
                        name="currentHours"
                        render={({ field: { value, onChange } }) => (
                            <TextInput
                                style={tw`border border-gray-300 rounded-lg p-2`}
                                placeholder="0"
                                value={value?.toString()}
                                onChangeText={onChange}
                                keyboardType="numeric"
                            />
                        )}
                    />
                    {errors.currentHours && (
                        <Text style={tw`text-red-500 text-xs mt-1`}>{errors.currentHours.message}</Text>
                    )}
                </View>

                <View>
                    <Text style={tw`text-xs text-gray-500 mb-1`}>Minutes</Text>
                    <Controller
                        control={control}
                        name="currentMinutes"
                        render={({ field: { value, onChange } }) => (
                            <TextInput
                                style={tw`border border-gray-300 rounded-lg p-2`}
                                placeholder="0"
                                value={value?.toString()}
                                onChangeText={onChange}
                                keyboardType="numeric"
                            />
                        )}
                    />
                    {errors.currentMinutes && (
                        <Text style={tw`text-red-500 text-xs mt-1`}>{errors.currentMinutes.message}</Text>
                    )}
                </View>
            </View>
        </View>
    );
};

export default AudioProgress;
