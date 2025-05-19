import React from 'react'
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import ReadingLogs from '@/components/books/ReadingLogs';
import { useFetchBookData } from '@/hooks/useBooks';
import BookHeader from '@/components/books/AddToLibraryDetails/BookHeader';
import FloatingActionButton from '@/components/shared/FloatingActionButton';


const log = () => {
    const { api_id } = useLocalSearchParams();
    const apiId = api_id as string;
    const { data: book } = useFetchBookData(api_id as string);

    const handleAddNewLog = () => {
        router.push(`/book/${apiId}/log-form`);
    }
    return (
        <SafeAreaView style={tw`flex-1 bg-white p-6`}>
            <Stack.Screen options={{
                title: "Reading Sessions",
            }} />
            {book ? <BookHeader book={book} /> : null}
            <ReadingLogs apiId={apiId} bookID={book?.id} />
            <FloatingActionButton
                icon="plus"
                onPress={handleAddNewLog}
                style={`bg-amber-600`}
            />
        </SafeAreaView>
    )
}

export default log