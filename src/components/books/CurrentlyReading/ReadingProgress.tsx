// components/books/ReadingProgress.jsx
import { View, Text } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import dayjs from 'dayjs';
import type { BookReadingLog, BookStatusHistory } from '@/types/book';

type ReadingProgressProps = {
    readingLog?: BookReadingLog;
    mostRecentStatus?: BookStatusHistory;
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({ readingLog, mostRecentStatus }) => {
    let { current_percentage, created_at, updated_at } = readingLog || {};
    const isComplete = mostRecentStatus && mostRecentStatus.status === 'completed';
    const isReading = mostRecentStatus && mostRecentStatus.status === 'current';

    const { created_at: statusCreatedAt } = mostRecentStatus || {};

    current_percentage = isComplete ? 100 : current_percentage ?? 0;
    const completetionDate = isComplete ? statusCreatedAt : null;
    const dateOfLog = completetionDate || updated_at || created_at;

    return (
        <View style={tw`mt-auto`}>
            {isReading || isComplete ?
                <View style={tw`w-full bg-gray-200 rounded-full h-1 mb-2`}>
                    <View
                        style={[
                            tw`bg-gray-800 h-1 rounded-full`,
                            { width: `${current_percentage}%` }
                        ]}
                    />
                </View> : null}
            {isReading || isComplete ?
                <Text style={tw`text-xs text-gray-600 mb-1`}>{current_percentage}
                    % complete
                </Text> : null}
            <Text style={tw`text-xs text-gray-600`}>
                {dateOfLog ? dayjs(dateOfLog).fromNow() : null}
            </Text>
        </View>
    );
};

export default ReadingProgress;
