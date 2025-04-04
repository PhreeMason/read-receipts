// src/app/book/[id]/index.tsx
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBookDetails } from '@/hooks/useBooks';
import { useBookStatus } from '@/hooks/useBookStatus';
import { Loading } from '@/components/shared/Loading';
import { useFetchBookData } from '@/hooks/useBooks';
import { SafeAreaView } from 'react-native';
import AddToLibraryDetails from '@/components/books/AddToLibraryDetails';
import tw from 'twrnc';
import { Stack } from 'expo-router';

export default function BookDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const { data: bookDetails, isLoading: isLoadingBook } = useFetchBookData(id as string);
    if (isLoadingBook || !bookDetails) {
        return <Loading />;
    }

    const handleAddToLibrary = () => {
        console.log('Add to library clicked');
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <Stack.Screen options={{
                title: "Add To Library"
            }} />
            <AddToLibraryDetails
                book={bookDetails}
                onAddToLibrary={handleAddToLibrary}
            />
        </SafeAreaView>
    );
}        