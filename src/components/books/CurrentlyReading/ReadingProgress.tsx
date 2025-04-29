// components/books/ReadingProgress.jsx
import { View, Text } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import dayjs from 'dayjs';
import type { UserBook } from '@/types/book';

type ReadingProgressProps = {
    userBook: UserBook;
}

function isAllNumbers(items: any[]) {
    return items.every(item => item !== null && !isNaN(item))
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({ userBook }) => {
    const { current_percentage, total_pages, total_duration, current_audio_time, current_page } = userBook

    //@ts-ignore  is possibly 'null'
    const audioProgress = isAllNumbers([total_duration, current_audio_time]) && current_audio_time > 0
        //@ts-ignore  is possibly 'null'
        ? current_audio_time / total_duration * 100
        : 0;

    //@ts-ignore  is possibly 'null'
    const pageProgress = isAllNumbers([current_page, total_pages]) && current_page > 0
        //@ts-ignore  is possibly 'null'
        ? current_page / total_duration * 100
        : 0;

    const currentPercentage = current_percentage || 0;
    const maxProgress = Math.floor(Math.max(currentPercentage, audioProgress, pageProgress))

    return (
        <View style={tw`mt-auto`}>
            <View style={tw`w-full bg-gray-200 rounded-full h-1 mb-2`}>
                <View
                    style={[
                        tw`bg-gray-800 h-1 rounded-full`,
                        { width: `${maxProgress}%` }
                    ]}
                />
            </View>
            <Text style={tw`text-xs text-gray-600 mb-1`}>{maxProgress}% complete</Text>
            <Text style={tw`text-xs text-gray-600`}>
                {userBook?.date_added ? dayjs(userBook.date_added).fromNow() : null}
            </Text>
        </View>
    );
};

export default ReadingProgress;
