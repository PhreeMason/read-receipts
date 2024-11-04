import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';
import { BookCover } from '@/components/book/BookCover';
import { BookStatusBadge } from './BookStatusBadge';
import { ReadingProgress } from './ReadingProgress';
import { BookStatus } from '@/types/book';
import type { Book } from '@/types/book';
import BookStatusButton from './BookStatusButton';

type BookDetailPresentationProps = {
    book: Book;
    currentStatus?: BookStatus;
    progress?: number;
    statusDates?: {
        started_at: string | null;
        finished_at: string | null;
        dnf_at: string | null;
        added_at: string | null;
    };
    onStartReading: () => void;
    onContinueReading: () => void;
};

export const BookDetailPresentation = ({
    book,
    currentStatus,
    progress,
    statusDates,
    onStartReading,
    onContinueReading
}: BookDetailPresentationProps) => {
    const isReading = currentStatus === 'reading';
    const canRead = currentStatus === 'to-read' || isReading;

    return (
        <ScrollView style={tw`flex-1 bg-white`}>
            <View style={tw`p-4`}>
                <View style={tw`flex-row`}>
                    <BookCover url={book.cover_url} className="w-32 h-48 rounded-lg" />
                    <View style={tw`ml-4 flex-1`}>
                        <Text style={tw`text-2xl font-bold text-gray-900`}>{book.title}</Text>
                        <Text style={tw`text-lg text-gray-600 mt-1`}>{book.author}</Text>
                        <View style={tw`mt-2`}>
                            {currentStatus ? <BookStatusBadge status={currentStatus} /> : null}
                        </View>
                        <View style={tw`mt-2`}>
                            <BookStatusButton bookId={book.id} />
                        </View>
                    </View>
                </View>

                {isReading && <ReadingProgress progress={progress} />}

                <View style={tw`mt-6`}>
                    {canRead && (
                        <TouchableOpacity
                            onPress={isReading ? onContinueReading : onStartReading}
                            style={tw`bg-blue-500 py-3 px-4 rounded-lg`}
                        >
                            <Text style={tw`text-white text-center font-medium`}>
                                {isReading ? 'Continue Reading' : 'Start Reading'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {book.description && (
                    <View style={tw`mt-6`}>
                        <Text style={tw`text-lg font-semibold text-gray-900 mb-2`}>About this book</Text>
                        <Text style={tw`text-gray-600 leading-6`}>{book.description}</Text>
                    </View>
                )}

                <View style={tw`mt-6`}>
                    <Text style={tw`text-lg font-semibold text-gray-900 mb-2`}>Reading History</Text>
                    <View style={tw`space-y-2`}>
                        {statusDates.added_at && (
                            <Text style={tw`text-gray-600`}>
                                Added on {new Date(statusDates.added_at).toLocaleDateString()}
                            </Text>
                        )}
                        {statusDates.started_at && (
                            <Text style={tw`text-gray-600`}>
                                Started on {new Date(statusDates.started_at).toLocaleDateString()}
                            </Text>
                        )}
                        {statusDates.finished_at && (
                            <Text style={tw`text-gray-600`}>
                                Finished on {new Date(statusDates.finished_at).toLocaleDateString()}
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};