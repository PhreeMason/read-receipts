import { View, Text } from 'react-native'
import React from 'react'
import tw from 'twrnc';

type RatingProps = {
    rating: string;
    maxRating?: number;
    showValue?: boolean;
    textStyle?: string;
    containerStyle?: string;
}

const Rating: React.FC<RatingProps> = ({
    rating,
    maxRating = 5,
    showValue = true,
    textStyle = 'text-xs',
    containerStyle = 'mt-1'
}) => {
    // Ensure rating is between 0 and maxRating
    const normalizedRating = Math.max(0, Math.min(parseFloat(rating), maxRating));

    // Calculate full and empty stars
    const fullStars = Math.floor(normalizedRating);
    const emptyStars = maxRating - fullStars;

    return (
        <View style={tw`flex flex-row ${containerStyle}`}>
            <Text style={tw`${textStyle} text-amber-600`}>{'★'.repeat(fullStars)}</Text>
            <Text style={tw`${textStyle} text-gray-300`}>{'☆'.repeat(emptyStars)}</Text>
            {showValue && (
                <Text style={tw`${textStyle} text-black ml-1`}>{normalizedRating.toFixed(1)}</Text>
            )}
        </View>
    )
}

export default Rating