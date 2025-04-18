import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { TouchableOpacity } from 'react-native';
import React from 'react';
import { useFetchBookStatusHistory } from '@/hooks/useBooks';
import tw from 'twrnc';
import { Loading } from '@/components/shared/Loading';

const statusToIcon = {
    default: <FontAwesome name="bookmark-o" size={12} color="rgb(107, 112, 128)" />,
    tbr: <FontAwesome name="bookmark" size={12} color="rgb(156, 123, 175)" />,
    current: <FontAwesome5 name="book-reader" size={12} color="rgb(96, 125, 250)" />,
    completed: <Feather name="book" size={12} color="rgb(74, 222, 128)" />, // TODO: get thicker book
    dnf: <Entypo name="cross" size={13} color="rgb(248, 113, 113)" />, // TODO: get bigger X
    pause: <FontAwesome6 name="pause" size={12} color="rgb(251, 191, 36)" />
}

const statusStyle = {
    default: 'border-gray-500 bg-gray-50',
    tbr: 'border-gray-500 bg-gray-50 px-2.5',
    current: 'border-blue-500 bg-blue-50',
    completed: 'border-green-500 bg-green-50',
    dnf: 'border-red-500 bg-red-50 px-2.2',
    pause: 'border-amber-500 bg-amber-50 px-3',
}

type BookStatusActionButtonProps = {
    book_api_id: string;
}

export const BookStatusActionButton: React.FC<BookStatusActionButtonProps> = ({ book_api_id }) => {
    const { data: bookStatusHistory, isLoading } = useFetchBookStatusHistory(book_api_id)
    if (isLoading) {
        return (
            <Loading size="small" />
        )
    }

    const bookStatus = bookStatusHistory?.status || 'default';
    // @ts-ignore
    const icon = bookStatus ? statusToIcon[bookStatus] : statusToIcon.default
    return (
        // @ts-ignore
        <TouchableOpacity style={tw`self-center p-2 border rounded-full ${statusStyle[bookStatus]}`}>
            {icon}
        </TouchableOpacity>
    )
}
