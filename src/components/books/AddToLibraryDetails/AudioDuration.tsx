import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Controller } from 'react-hook-form';
import tw from 'twrnc';

type AudioDurationProps = {
    control: any;
    errors: any;
};

const AudioDuration: React.FC<AudioDurationProps> = ({ control, errors }) => {
    return (
        <View style={tw`gap-4 mt-4`}>
            <Text style={tw`text-sm font-semibold text-gray-700 mb-1`}>Audiobook Total Time</Text>
            <View style={tw`flex flex-row gap-4`}>
                <View>
                    <Text style={tw`text-xs text-gray-500 mb-1`}>Hours</Text>
                    <Controller
                        control={control}
                        name="hours"
                        render={({ field: { value, onChange } }) => (
                            <TextInput
                                style={tw.style(
                                    'border border-gray-300 rounded-lg p-2',
                                    errors.hours && 'border-red-600'
                                )}
                                placeholder="0"
                                value={value?.toString() ?? ''}
                                onChangeText={onChange}
                                keyboardType="numeric"
                            />
                        )}
                    />
                    {errors.hours && (
                        <Text style={tw`text-red-600 text-xs mt-1`}>
                            {errors.hours.message}
                        </Text>
                    )}
                </View>
                <View>
                    <Text style={tw`text-xs text-gray-500 mb-1`}>Minutes</Text>
                    <Controller
                        control={control}
                        name="minutes"
                        render={({ field: { value, onChange } }) => (
                            <TextInput
                                style={tw.style(
                                    'border border-gray-300 rounded-lg p-2',
                                    errors.minutes && 'border-red-600'
                                )}
                                placeholder="0"
                                value={value?.toString() ?? ''}
                                onChangeText={onChange}
                                keyboardType="numeric"
                            />
                        )}
                    />
                    {errors.minutes && (
                        <Text style={tw`text-red-600 text-xs mt-1`}>
                            {errors.minutes.message}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};

export default AudioDuration;