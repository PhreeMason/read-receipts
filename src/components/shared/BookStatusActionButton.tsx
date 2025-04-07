import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from 'twrnc';

const statusToIcon = {
    default: <FontAwesome name="bookmark-o" size={24} color="gray" />, // light-gray
    tbr: <FontAwesome name="bookmark" size={24} color="gray" />, // dark gray
    current: <FontAwesome5 name="book-reader" size={24} color="bluee" />, // light blue
    completed: <Feather name="book" size={24} color="green" />, // light green
    dnf: <Entypo name="cross" size={24} color="red" />, // dnf red
    pause: <FontAwesome6 name="pause" size={24} color="amber" /> // yellow/amber
}

const getBookStatus = (bookId) => {
    const statuses = ["tbr", "current", "completed", "dnf", "pause"]
    return statuses[
        Math.floor(Math.random() * statuses.length)
    ]
}


type BookStatusActionButtonProps = {
    bookId: string;
}

export const BookStatusActionButton: React.FC<BookStatusActionButtonProps> = ({ bookId }) => {
    console.log({bookId})
    const bookStatus = getBookStatus(bookId)
    console.log({bookStatus})
    const icon = bookStatus ? statusToIcon[bookStatus] : statusToIcon.default
    return (
        <TouchableOpacity style={tw`self-center p-2 rounded-full hover:bg-gray-100`}>
            {icon}
        </TouchableOpacity>
    )
}
