import { View, Text } from 'react-native';
import tw from 'twrnc';

const Tags = ({ title, items, bgColor, textColor }: {
    title: string, items: string[], bgColor: string, textColor: string
}) => (
    <View style={tw`mb-4`}>
        <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>{title}</Text>
        <View style={tw`flex-row flex-wrap gap-2`}>
            {items.map(item => (
                <View key={item} style={tw`${bgColor} rounded-full px-3 py-1`}>
                    <Text style={tw`${textColor} text-sm`}>{item}</Text>
                </View>
            ))}
        </View>
    </View>
);

export default Tags;