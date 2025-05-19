import { Stack, useLocalSearchParams } from 'expo-router';
import ReadingLogsForm from '@/components/books/ReadingLogs/ReadingLogsForm'
import React from 'react'
import BookHeader from '@/components/books/AddToLibraryDetails/BookHeader';
import { useFetchBookData, useGetReadingLogs, useGetUserBookCurrentStateData } from '@/hooks/useBooks';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

const LogForm = () => {

    const { api_id } = useLocalSearchParams();
    const apiId = api_id as string;
    const { data: book } = useFetchBookData(apiId);
    const { data: userBook } = useGetUserBookCurrentStateData(book?.id);
    const { data: readingLogs } = useGetReadingLogs(book?.id);

    return (
        <SafeAreaView style={tw`flex-1 bg-white p-6`}>

            <Stack.Screen
                options={{
                    title: 'Add Reading Session',
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                }}
            />
            {book ? <BookHeader book={book} /> : null}
            <ReadingLogsForm userBook={userBook} readingLogs={readingLogs} />
        </SafeAreaView>
    )
}

export default LogForm