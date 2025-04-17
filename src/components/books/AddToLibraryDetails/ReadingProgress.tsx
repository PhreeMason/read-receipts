import React from 'react';
import { View, Text, TouchableOpacity, Platform, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Controller } from 'react-hook-form';
import tw from 'twrnc';

type ReadingProgressProps = {
    control: any;
    errors: any;
    setValue: any;
    formatDate: (date: Date) => string;
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({
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

            <View>
                <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Current Progress</Text>
                <View style={tw`flex-row items-center`}>
                    <Controller
                        control={control}
                        name="currentPage"
                        render={({ field: { value, onChange } }) => (
                            <TextInput
                                style={tw`border border-gray-300 rounded-lg p-2 w-20 text-center`}
                                value={value?.toString()}
                                onChangeText={onChange}
                                keyboardType="numeric"
                            />
                        )}
                    />
                    <Text style={tw`mx-2 text-sm text-gray-600`}>of</Text>

                    <Controller
                        control={control}
                        name="totalPage"
                        render={({ field: { value, onChange } }) => (
                            <TextInput
                                style={tw`border border-gray-300 rounded-lg p-2 w-20 text-center`}
                                value={value?.toString()}
                                onChangeText={onChange}
                                keyboardType="numeric"
                            />
                        )}
                    />

                    <Text style={tw`text-sm font-medium`}> pages</Text>
                </View>
                {errors.currentPage && <Text style={tw`text-red-500 text-xs mt-1`}>{errors.currentPage.message}</Text>}
                {errors.totalPage && <Text style={tw`text-red-500 text-xs mt-1`}>{errors.totalPage.message}</Text>}
            </View>
        </View>
    );
};

export default ReadingProgress;
