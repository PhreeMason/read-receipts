import { TouchableOpacity, View, Text } from 'react-native';
import tw from 'twrnc';
import { useAuth } from '@/providers/AuthProvider';

export default function HomeScreen() {
    const { signOut } = useAuth();

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
                onPress={signOut}
                style={tw`bg-red-500 p-4 rounded-lg`}
            >
                <Text style={tw`text-white text-lg`}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}
