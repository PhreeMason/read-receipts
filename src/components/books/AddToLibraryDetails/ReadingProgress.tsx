import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import tw from 'twrnc';

const ReadingProgress = ({
    currentPage,
    setCurrentPage,
    totalPages,
    startDate,
    targetDate,
    showStartDatePicker,
    showTargetDatePicker,
    setShowStartDatePicker,
    setShowTargetDatePicker,
    onDateChange,
    formatDate
}) => {
    return (
        <View style={tw`gap-4 border-t border-gray-200 pt-4`}>
            <View>
                <Text style={tw`block text-sm font-medium text-gray-700 mb-1`}>Current Progress</Text>
                <View style={tw`flex-row items-center`}>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg p-2 w-20 text-center`}
                        value={currentPage}
                        onChangeText={setCurrentPage}
                        keyboardType="numeric"
                    />
                    <Text style={tw`mx-2 text-sm text-gray-600`}>of</Text>
                    <Text style={tw`text-sm font-medium`}>{totalPages} pages</Text>
                </View>
            </View>

            <View style={tw`flex flex-row gap-2 justify-between`}>
                <View style={tw`w-50%`}>
                    <Text style={tw`block text-sm font-medium text-gray-700 mb-1`}>Start Date</Text>
                    <TouchableOpacity
                        style={tw`border border-gray-300 rounded-lg p-3`}
                        onPress={() => setShowStartDatePicker(true)}
                    >
                        <Text>{formatDate(startDate)}</Text>
                    </TouchableOpacity>
                    {showStartDatePicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, date) => onDateChange(event, date, 'start')}
                        />
                    )}
                </View>

                <View style={tw`w-50%`}>
                    <Text style={tw`block text-sm font-medium text-gray-700 mb-1`}>Target Completion Date</Text>
                    <TouchableOpacity
                        style={tw`border border-gray-300 rounded-lg p-3`}
                        onPress={() => setShowTargetDatePicker(true)}
                    >
                        <Text>{formatDate(targetDate)}</Text>
                    </TouchableOpacity>
                    {showTargetDatePicker && (
                        <DateTimePicker
                            value={targetDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, date) => onDateChange(event, date, 'target')}
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

export default ReadingProgress;