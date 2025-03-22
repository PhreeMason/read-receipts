// src/app/book/[id]/index.tsx
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBookDetails } from '@/hooks/useBooks';
import { useBookStatus } from '@/hooks/useBookStatus';
import { BookDetailPresentation } from '@/components/book/BookDetailPresentation';
import { Loading } from '@/components/shared/Loading';
import { Alert } from 'react-native';

export default function BookDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const { data: bookDetails, isLoading: isLoadingBook } = useBookDetails(id as string);
    const { currentStatus, progress, statusDates } = useBookStatus(id as string);
    if (isLoadingBook || !bookDetails) {
        return <Loading />;
    }

    const handleAddToLibrary = () => {
        
    };

    return (
        <BookDetailPresentation
            book={bookDetails}
            currentStatus={currentStatus}
            progress={progress}
            statusDates={statusDates}
            onStartReading={() => {}}
            onContinueReading={() => {}}
        />
    );
}        