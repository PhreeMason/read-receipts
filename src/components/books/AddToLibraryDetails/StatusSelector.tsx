import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import tw from 'twrnc';

const StatusSelector = ({ status, setStatus }) => {
    return (
        <View>
            <Text style={tw`block text-sm font-medium text-gray-700 mb-1`}>Status *</Text>
            <View style={tw`border border-gray-300 rounded-lg`}>
                <Picker
                    selectedValue={status}
                    onValueChange={(itemValue) => setStatus(itemValue)}
                    style={tw`h-12`}
                >
                    <Picker.Item label="To Be Read" value="tbr" />
                    <Picker.Item label="Currently Reading" value="current" />
                    <Picker.Item label="Completed" value="completed" />
                    <Picker.Item label="Did Not Finish" value="dnf" />
                </Picker>
            </View>
        </View>
    );
};

export default StatusSelector;