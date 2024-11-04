import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import tw from 'twrnc';
import { useUserBookStatus, useCreateUserBook } from '@/hooks/useBookStatus';
import { useUpdateBookStatus } from '@/hooks/useBooks';
import { Database } from '@/types/supabase';

type BookStatus = Database['public']['Enums']['book_status'];

const statusOptions: BookStatus[] = ['to-read', 'reading', 'read', 'did-not-finish'];

const statusLabels: Record<BookStatus, string> = {
    'to-read': 'Want to Read',
    'reading': 'Currently Reading',
    'read': 'Finished',
    'did-not-finish': 'Did Not Finish',
};

const BookStatusButton = ({ bookId }: { bookId: string }) => {
    const { data: userBook, isLoading } = useUserBookStatus(bookId);
    const createBook = useCreateUserBook();
    const updateStatus = useUpdateBookStatus();
    const [showOptions, setShowOptions] = React.useState(false);

    const handleStatusChange = (status: BookStatus) => {
        if (status === userBook?.status) {
            setShowOptions(false);
            return;
        }
        if (userBook) {
            updateStatus.mutate({
                userBookId: userBook.id,
                status,
            });
        } else {
            createBook.mutate({
                bookId,
                status,
            });
        }
        setShowOptions(false);
    };

    const isUpdating = createBook.isPending || updateStatus.isPending;

    if (isLoading) {
        return (
            <View style={tw`bg-gray-100 rounded-lg p-3`}>
                <Text style={tw`text-gray-500 text-center`}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={tw`relative`}>
            <TouchableOpacity
                style={tw`bg-blue-500 rounded-lg p-3 ${isUpdating ? 'opacity-50' : ''}`}
                onPress={() => setShowOptions(!showOptions)}
                disabled={isUpdating}
            >
                <Text style={tw`text-white text-center font-medium`}>
                    {userBook ? statusLabels[userBook.status] : 'Want to Read'}
                </Text>
            </TouchableOpacity>

            {showOptions && (
                <View style={tw.style(`absolute top-full left-0 right-0 rounded-lg mt-2 shadow-lg`, 
                {zIndex: 10, backgroundColor: 'white'})
                }>
                    {statusOptions.map((status) => (
                        <TouchableOpacity
                            key={status}
                            style={tw`p-3 border-b border-gray-100`}
                            onPress={() => handleStatusChange(status)}
                        >
                            <Text style={tw`${userBook?.status === status ? 'text-blue-500' : 'text-gray-700'}`}>
                                {statusLabels[status]}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

export default BookStatusButton;