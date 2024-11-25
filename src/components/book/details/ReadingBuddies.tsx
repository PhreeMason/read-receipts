import { View, Text } from 'react-native';
import tw from 'twrnc';

type ReadingBuddiesProps = {
    buddies: { name: string, progress: number }[];
};


const ReadingBuddies = ({ buddies }: ReadingBuddiesProps) => (
    <View style={tw`bg-white rounded-lg p-4 shadow-sm`}>
        <Text style={tw`font-medium mb-3`}>Reading with You</Text>
        {buddies.map((buddy) => (
            <View key={buddy.name} style={tw`flex-row items-center justify-between mb-3`}>
                <Text style={tw`text-sm`}>{buddy.name}</Text>
                <View style={tw`w-32 h-2 bg-gray-200 rounded-full overflow-hidden`}>
                    <View style={[tw`h-full bg-blue-500 rounded-full`, { width: `${buddy.progress}%` }]} />
                </View>
            </View>
        ))}
    </View>
);

export default ReadingBuddies