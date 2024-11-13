import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from 'twrnc';

type ActionButtonProps = {
    getActionButton: () => {
        label: string;
        icon: any;
        action: () => void;
        loading: boolean;
    };
};

const ActionButtons = ({ getActionButton }: ActionButtonProps) => {
    
    const button = getActionButton();
    
    return (
        <TouchableOpacity
            onPress={button.action}
            disabled={button.loading}
            style={tw`flex-1 bg-blue-600 py-3 px-4 rounded-lg flex-row items-center justify-center`}
        >
            {button.loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <>
                    <button.icon size={20} color="white" />
                    <Text style={tw`text-white ml-2`}>{button.label}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

export default ActionButtons;