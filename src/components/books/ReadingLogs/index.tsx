import { View, Text, TouchableOpacity } from 'react-native'
import tw from 'twrnc';
import React from 'react'
import { useGetReadingLogs } from '@/hooks/useBooks';

type ReadingLogProps = {
    bookID: string;
}

type ReadingLogItem = {
    id: string;
    time: string;
    duration: string;
    pages_read: number;
    minutes_listened: string;
}

const ReadingLogs: React.FC<ReadingLogProps> = ({ bookID }) => {
    const { data: readingLogs, isLoading } = useGetReadingLogs(bookID);
    console.log({ readingLogs })
    const Logs: ReadingLogItem[] = []

    // get first log from user book
    return (
        <View style={tw`mb-8`}>
            <View style={tw`flex-row justify-between mb-2`}>
                <Text style={tw`text-sm font-semibold text-black`}>Reading Sessions</Text>
                <TouchableOpacity>
                    <Text style={tw`text-xs text-black underline`}>See All</Text>
                </TouchableOpacity>
            </View>
            <View style={tw`gap-3`}>
                <View style={tw`flex bg-white rounded-xl p-3 border border-gray-100 shadow-sm`}>
                    <View style={tw`flex-row justify-between items-center mb-2`}>
                        <Text style={tw`text-xs font-medium text-black`}>Today</Text>
                        <Text style={tw`text-xs text-black`}>45 min</Text>
                    </View>
                    <View style={tw`flex-row justify-between items-center`}>
                        <Text style={tw`text-xs text-black`}>Pages 176-196</Text>
                        <Text style={tw`text-xs text-green-600`}>+20 pages</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default ReadingLogs