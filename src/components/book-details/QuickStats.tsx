import { View, Text } from 'react-native';
import tw from 'twrnc';
import {
    Users,
    Heart,
    Timer,
} from 'lucide-react-native';

type BookData = {
    estimatedReadingTime: string;
    completionRate: string;
}

type QuickStatsProps = {
    bookData: BookData;
};


const QuickStats = ({ bookData }: { bookData: any }) => (
    <View style={tw`flex-row justify-between gap-4`}>
        <View style={tw`flex-1 bg-white p-3 rounded-lg items-center`}>
            <Timer size={20} color="#3B82F6" />
            <Text style={tw`text-sm font-medium`}>{bookData.estimatedReadingTime}</Text>
            <Text style={tw`text-xs text-gray-500`}>Est. Time</Text>
        </View>
        <View style={tw`flex-1 bg-white p-3 rounded-lg items-center`}>
            <Users size={20} color="#8B5CF6" />
            <Text style={tw`text-sm font-medium`}>{bookData.completionRate}</Text>
            <Text style={tw`text-xs text-gray-500`}>Completion</Text>
        </View>
        <View style={tw`flex-1 bg-white p-3 rounded-lg items-center`}>
            <Heart size={20} color="#EF4444" />
            <Text style={tw`text-sm font-medium`}>4.8/5</Text>
            <Text style={tw`text-xs text-gray-500`}>Enjoyed by</Text>
        </View>
    </View>
);

export default QuickStats;