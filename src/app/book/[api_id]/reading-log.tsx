import { View, Text } from 'react-native'
import React from 'react'
import ReadingLogsForm from '@/components/books/ReadingLogs/ReadingLogsForm'
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import ReadingLogs from '@/components/books/ReadingLogs';

const log = () => {
    const { api_id } = useLocalSearchParams();

    return (
        <SafeAreaView style={tw`flex-1 bg-white p-6`}>
            <Stack.Screen options={{
                title: "Reading Logs"
            }} />
            <ReadingLogs bookID={api_id as string} hideSeeAll />
            {/* <ReadingLogsForm /> */}
        </SafeAreaView>
    )
}

export default log