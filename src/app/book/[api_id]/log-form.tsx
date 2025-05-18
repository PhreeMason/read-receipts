import { View, Text } from 'react-native'
import { Stack, Link, router } from 'expo-router';
import ReadingLogsForm from '@/components/books/ReadingLogs/ReadingLogsForm'
import React from 'react'
import BookHeader from '@/components/books/AddToLibraryDetails/BookHeader';

const LogForm = () => {
    const isPresented = router.canGoBack();
    return (
        <View>
            <Stack.Screen
                options={{
                    title: 'Add Reading Session',
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                }}
            />
            {isPresented && <Link href="../">Dismiss modal</Link>}
            {/* <BookHeader /> */}
            <ReadingLogsForm />
        </View>
    )
}

export default LogForm