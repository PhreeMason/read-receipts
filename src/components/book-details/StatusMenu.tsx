import { View, Text, TouchableOpacity } from 'react-native';
import type { ReadingStatus, StatusOption } from '@/types/book';
import tw from 'twrnc';
import { convertTailwindColor } from '@/utils/constants';

type StatusMenuProps = {
    isOpen: boolean;
    statusOptions: StatusOption[];
    currentStatus: ReadingStatus | null;
    onStatusChange: (status: ReadingStatus) => void;
};


const StatusMenu = ({ isOpen, statusOptions, currentStatus, onStatusChange }: StatusMenuProps) => {
    if (!isOpen) return null;

    return (
        <View style={tw`bg-white border-t border-gray-200 shadow-lg rounded-t-lg overflow-hidden mt-5 pt-5`}>
            {statusOptions.map((option) => (
                <TouchableOpacity
                    key={option.id}
                    onPress={() => onStatusChange(option.id)}
                    style={tw`w-full p-4 flex-row items-center gap-3 ${currentStatus === option.id ? option.bgColor : ''
                        }`}
                >
                    <View style={tw`w-8 h-8 rounded-full ${option.bgColor} items-center justify-center`}>
                        <option.icon size={16} color={convertTailwindColor(option.color)} />
                    </View>
                    <View>
                        <Text style={tw`font-medium`}>{option.label}</Text>
                        <Text style={tw`text-sm text-gray-600`}>{option.description}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default StatusMenu;