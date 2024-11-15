import { View, Text, Image } from 'react-native';
import type { ReadingStatus, StatusOption } from '@/types/book';
import tw from 'twrnc';
import { convertTailwindColor } from '@/utils/constants';
import {
    Star,
    Users,
    MessageCircle,
} from 'lucide-react-native';
import { getCurrentStatusDetails } from '@/utils/helpers';

interface BookData {
    coverUrl: string;
    title: string;
    author: string;
    rating: number;
    totalRatings: number;
    activeReaders: number;
    totalAnnotations: number;
}

interface BookCoverProps {
    bookData: BookData;
    currentStatus: ReadingStatus | null;
}


const BookCover = ({ bookData, currentStatus }: BookCoverProps) => (
    <View style={tw`flex-row gap-4`}>
        <Image
            source={{ uri: bookData.coverUrl }}
            style={tw`w-32 h-48 rounded-lg`}
            resizeMode="cover"
        />
        <View style={tw`flex-1 justify-between`}>
            <View>
                <Text style={tw`text-xl font-bold`}>{bookData.title}</Text>
                <Text style={tw`text-gray-600 mb-2`}>by {bookData.author}</Text>
                <View style={tw`flex-row items-center gap-1 mb-2`}>
                    <Star size={16} color="#FBBF24" fill="#FBBF24" />
                    <Text style={tw`text-sm font-medium`}>{bookData.rating}</Text>
                    <Text style={tw`text-sm text-gray-500`}>({bookData.totalRatings})</Text>
                </View>
                {currentStatus && (
                    <View style={tw`flex-row items-center gap-2`}>
                        {(() => {
                            const statusDetails = getCurrentStatusDetails(currentStatus);
                            const IconComponent = statusDetails.icon;
                            return (
                                <>
                                    <IconComponent
                                        size={16}
                                        color={convertTailwindColor(statusDetails.color)}
                                    />
                                    <Text style={tw`${statusDetails.color}`}>
                                        {statusDetails.label}
                                    </Text>
                                </>
                            );
                        })()}
                    </View>
                )}
                <View style={tw`flex-row gap-3 mt-2`}>
                    <View style={tw`flex-row items-center gap-1`}>
                        <Users size={16} color="#3B82F6" />
                        <Text style={tw`text-sm text-gray-600`}>{bookData.activeReaders} reading</Text>
                    </View>
                    <View style={tw`flex-row items-center gap-1`}>
                        <MessageCircle size={16} color="#3B82F6" />
                        <Text style={tw`text-sm text-gray-600`}>{bookData.totalAnnotations}</Text>
                    </View>
                </View>
            </View>
        </View>
    </View>
);

export default BookCover;