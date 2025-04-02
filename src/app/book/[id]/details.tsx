// src/app/book/[id]/index.tsx
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBookDetails } from '@/hooks/useBooks';
import { useBookStatus } from '@/hooks/useBookStatus';
import { BookDetailPresentation } from '@/components/book/BookDetailPresentation';
import { Loading } from '@/components/shared/Loading';
import { useFetchBookData } from '@/hooks/useBooks';
import { Text } from 'react-native';

export default function BookDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const { data: bookDetails, isLoading: isLoadingBook } = useFetchBookData(id as string);
    if (isLoadingBook || !bookDetails) {
        return <Loading />;
    }

    const handleAddToLibrary = () => {

    };

    return (
        <Text>{
            JSON.stringify({
                bookDetails
            }, null, 2)
        }</Text>
    );
}        