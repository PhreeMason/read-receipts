import React from 'react';
import { View, Text, TouchableOpacity, Platform, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Controller } from 'react-hook-form';
import tw from 'twrnc';

type ReadingDatesProps = {
    control: any;
    errors: any;
    setValue: any;
    formatDate: (date: Date) => string;
}

const ReadingDates: React.FC<ReadingDatesProps> = ({
    control,
    errors,
    setValue,
    formatDate
}) => {
    return (
        <View style={tw`gap-4 border-t border-gray-200 pt-4`}>
            <View style={tw`flex flex-row gap-2 justify-between`}>
                <View style={tw`w-50%`}>
                    <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Start Date</Text>
                    <Controller
                        control={control}
                        name="startDate"
                        render={({ field: { value } }) => (
                            <>
                                <TouchableOpacity
                                    style={tw`border border-gray-300 rounded-lg p-3`}
                                    onPress={() => setValue('showStartDatePicker', true)}
                                >
                                    <Text>{formatDate(value)}</Text>
                                </TouchableOpacity>

                                {control._formValues.showStartDatePicker && (
                                    <DateTimePicker
                                        value={value}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={(event, date) => {
                                            if (date) {
                                                setValue('startDate', date);
                                                setValue('showStartDatePicker', false);
                                            }
                                        }}
                                    />
                                )}
                            </>
                        )}
                    />
                    {errors.startDate && <Text style={tw`text-red-500 text-xs mt-1`}>{errors.startDate.message}</Text>}
                </View>

                <View style={tw`w-50%`}>
                    <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Target Completion Date</Text>
                    <Controller
                        control={control}
                        name="targetDate"
                        render={({ field: { value } }) => (
                            <>
                                <TouchableOpacity
                                    style={tw`border border-gray-300 rounded-lg p-3`}
                                    onPress={() => setValue('showTargetDatePicker', true)}
                                >
                                    <Text>{formatDate(value)}</Text>
                                </TouchableOpacity>

                                {control._formValues.showTargetDatePicker && (
                                    <DateTimePicker
                                        value={value}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={(event, date) => {
                                            if (date) {
                                                setValue('targetDate', date);
                                                setValue('showTargetDatePicker', false);
                                            }
                                        }}
                                    />
                                )}
                            </>
                        )}
                    />
                    {errors.targetDate && <Text style={tw`text-red-500 text-xs mt-1`}>{errors.targetDate.message}</Text>}
                </View>
            </View>
        </View>
    );
};

export default ReadingDates;
