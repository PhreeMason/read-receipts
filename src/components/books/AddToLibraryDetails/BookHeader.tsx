import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { BookInsert } from '@/types/book';
import { mediumShadow } from '@/utils/constants';
import { formatAutorName } from '@/utils/helpers';

type BookCoverProps = {
    imageUrl: string;
}

const BookCover: React.FC<BookCoverProps> = ({ imageUrl }) => (
    <View style={tw.style(`w-24 h-36 rounded-md overflow-hidden`, mediumShadow)}>
        <Image
            source={{ uri: imageUrl }}
            style={tw`w-full h-full`}
            resizeMode="cover"
        />
    </View>
);

type StarRatingProps = {
    rating: number
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => (
    <View style={tw`flex-row`}>
        {[...Array(Math.floor(rating))].map((_, i) => (
            <Ionicons key={i} name="star" size={14} color="#8C6A5B" />
        ))}
        {rating % 1 > 0 && <Ionicons name="star-half" size={14} color="#8C6A5B" />}
        {[...Array(5 - Math.ceil(rating))].map((_, i) => (
            <Ionicons key={i + Math.ceil(rating)} name="star-outline" size={14} color="#8C6A5B" />
        ))}
    </View>
);

type BookHeaderProps = {
    book?: BookInsert;
}

// TODO: make all items in book header clickable

const BookHeader: React.FC<BookHeaderProps> = ({ book }) => {
    if (!book) return null;
    const [authorsExpanded, setAuthorsExpanded] = useState(false);

    const { title, cover_image_url, rating, metadata, genres, total_pages, publication_date } = book;
    // @ts-ignore
    let { authors, rating_count } = metadata || {};
    authors = authors ?? [];

    const toggleAuthorsExpanded = () => setAuthorsExpanded(!authorsExpanded);
    const displayedAuthors = authorsExpanded ? authors : authors.slice(0, 2);
    const shouldShowToggle = authors.length > 2;

    return (
        <View style={tw`flex-row gap-4 mb-6`}>
            <View style={tw`flex-shrink-0`}>
                <BookCover imageUrl={cover_image_url || ''} />
            </View>

            <View style={tw`flex-grow pl-2`}>
                <Text style={tw`font-bold text-lg text-black mb-1`}>{title}</Text>

                <View style={tw`flex-col mb-2`}>
                    {displayedAuthors.map(formatAutorName).map((name: string) => (
                        <Text style={tw`text-gray-600 text-sm`} key={name}>{name}</Text>
                    ))}

                    {shouldShowToggle ? (
                        <Text
                            style={tw`text-gray-300 text-xs`}
                            onPress={toggleAuthorsExpanded}
                        >
                            {authorsExpanded ? 'Show less' : 'Show more'}
                        </Text>
                    ) : null}
                </View>

                <View style={tw`flex-row items-center mb-1`}>
                    {rating ? <StarRating rating={rating} /> : null}
                    <Text style={tw`text-xs text-gray-500 ml-1`}>
                        {rating} ({rating_count?.toLocaleString()} ratings)
                    </Text>
                </View>

                <Text style={tw`text-xs text-gray-500 mb-1`}>
                    {genres?.slice(0, 2).join(' • ')} • {total_pages} pages
                </Text>

                {publication_date ? <Text style={tw`text-xs text-gray-500`}>
                    Published {new Date(publication_date).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    })}
                </Text> : null}
            </View>
        </View>
    );
};

export default BookHeader;