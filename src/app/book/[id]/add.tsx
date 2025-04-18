// src/app/book/[id]/index.tsx
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Loading } from '@/components/shared/Loading';
import { useFetchBookData } from '@/hooks/useBooks';
import { SafeAreaView } from 'react-native';
import AddToLibraryDetails from '@/components/books/AddToLibraryDetails';
import tw from 'twrnc';
import { Stack } from 'expo-router';
import { BookAndUserBookInsert } from '@/types/book';
import { useSaveUserBook } from '@/hooks/useBooks';
import { useState } from 'react';

export default function BookDetailScreen() {
    const { id } = useLocalSearchParams();
    const { mutate: saveUserBook } = useSaveUserBook();
    const router = useRouter();

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const { data: bookDetails, isLoading: isLoadingBook } = useFetchBookData(id as string);
    if (isLoadingBook || !bookDetails) {
        return <Loading />;
    }

    const handleAddToLibrary = (data: BookAndUserBookInsert) => {
        saveUserBook(data, {
            onSuccess: () => {
                // router.back();
                console.log('Book added to library successfully');
            },
            onError: (error) => {
                console.error('Error adding book to library:', error);
            }
        })
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <Stack.Screen options={{
                title: "Add To Library"
            }} />
            <AddToLibraryDetails
                book={bookDetails}
                onAddToLibrary={handleAddToLibrary}
                saving={saving}
                saved={saved}
            />
        </SafeAreaView>
    );
}        