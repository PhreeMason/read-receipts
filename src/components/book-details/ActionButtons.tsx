import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import {
    Book,
    BookOpen,
} from 'lucide-react-native';
import { getCurrentStatusDetails } from '@/utils/helpers';

type ActionButtonProps = {
    currentStatus: string | null;
    handleAddToLibrary: () => void;
    isAddingToLibrary: boolean;
};

const ActionButtons = ({ currentStatus, handleAddToLibrary, isAddingToLibrary  }: ActionButtonProps) => {
    const getActionButton = () => {
        if (!currentStatus) {
            return {
                label: "Add to Library",
                icon: BookOpen,
                action: handleAddToLibrary,
                loading: isAddingToLibrary
            };
        }

        const status = getCurrentStatusDetails(currentStatus);

        return {
            label: status?.actionLabel || "Start Reading",
            icon: status?.id === "finished" ? Book : BookOpen,
            action: () => console.log(`Navigate to reader - ${status?.id}`),
            loading: false
        };
    };
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