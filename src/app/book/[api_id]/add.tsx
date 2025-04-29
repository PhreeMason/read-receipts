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
import Toast from 'react-native-toast-message';

export default function BookDetailScreen() {
    const { api_id } = useLocalSearchParams();
    const { mutate: saveUserBook } = useSaveUserBook();
    const router = useRouter();

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const { data: bookDetails, isLoading: isLoadingBook } = useFetchBookData(api_id as string);
    if (isLoadingBook || !bookDetails) {
        return <Loading />;
    }

    const handleAddToLibrary = (data: BookAndUserBookInsert) => {
        setSaving(true);
        saveUserBook(data, {
            onSuccess: () => {
                Toast.show({
                    type: 'success',
                    text1: 'Book added to library',
                    autoHide: true,
                    visibilityTime: 2000,
                    position: 'top',
                    onHide: () => {
                        setSaved(true);
                        setSaving(false);
                        router.back();
                    }
                });
            },
            onError: (error) => {
                console.error('Error adding book to library:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Error adding book to library',
                    text2: error.message,
                });
                setSaving(false);
                setSaved(false);
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