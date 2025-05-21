import { View, Text } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Entypo, MaterialIcons } from '@expo/vector-icons'
import { UserBook } from '@/types/book';


export type BookFormat = 'ebook' | 'audio' | 'physical';

type FormatDisplayProps = {
    format: UserBook['format'];
}

const formatTypeIcons: Record<BookFormat, JSX.Element> = {
    'ebook': <Entypo name="tablet" size={20} color="black" />,
    'physical': <Entypo name="book" size={20} color="black" />,
    'audio': <MaterialIcons name="headphones" size={20} color="black" />,
}


const FormatDisplay: React.FC<FormatDisplayProps> = ({ format }) => {
    if (!format || !format.length) {
        return null;
    }

    return (
        <View>
            <View style={tw`flex-row gap-3`}>
                {format.map((formatType) => {
                    if (!formatType) return null; // Ensure formatType is not null or undefined

                    return (
                        <View
                            style={tw`text-white text-xs rounded-lg`}
                            key={formatType}
                        >
                            {formatTypeIcons[formatType] ? (
                                formatTypeIcons[formatType]
                            ) : (
                                <Text style={tw`text-center text-white`}>{formatType}</Text>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default FormatDisplay