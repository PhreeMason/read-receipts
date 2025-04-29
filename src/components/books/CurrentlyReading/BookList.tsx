// components/books/BookList.jsx
import { ScrollView } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { Loading } from '@/components/shared/Loading';
import BookCard from './BookCard';
import { BookStatusResponse } from '@/types/book'

type BookListProps = {
    books: BookStatusResponse[];
    isLoading: boolean;
    onBookPress: (id: string) => void;
}

const BookList: React.FC<BookListProps> = ({ books, isLoading, onBookPress }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={tw`overflow-visible`}
            contentContainerStyle={tw`gap-4 pb-2`}
        >
            {isLoading ? (
                <Loading />
            ) : (
                books?.map((book) => (
                    <BookCard key={book.id} book={book} onPress={onBookPress} />
                ))
            )}
        </ScrollView>
    );
};

export default BookList;
