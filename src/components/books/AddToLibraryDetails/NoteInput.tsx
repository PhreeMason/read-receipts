import React from 'react';
import { View, Text, TextInput } from 'react-native';
import tw from 'twrnc';

type NoteInputProps = {
    note: string;
    setNote: (text: string) => void;
}

const NoteInput: React.FC<NoteInputProps> = ({ note, setNote }) => {
    return (
        <View>
            <Text style={tw`text-sm font-semibold text-gray-700 mb-1`}>Note</Text>
            <TextInput
                style={tw`border border-gray-300 rounded-lg p-3 h-24`}
                placeholder="Add a note about this book..."
                multiline
                value={note}
                onChangeText={setNote}
            />
        </View>
    );
};

export default NoteInput;