import { TouchableOpacity } from "react-native";
import React from "react";
import tw from "twrnc";
import { AntDesign } from '@expo/vector-icons';

type FloatingActionButtonProps = {
    icon: string;
    onPress: () => void;
    style?: string;
};

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ icon, onPress, style }) => {
    return (
        <TouchableOpacity
            style={tw.style(
                `absolute bottom-6 right-6 w-14 h-14 rounded-full shadow-lg 
           justify-center items-center bg-amber-600`,
                style
            )}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* @ts-ignore ype 'string' is not assignable to type '"profile" | "key" | ... */}
            <AntDesign name={icon} size={24} color="white" />

        </TouchableOpacity>
    );
};

export default FloatingActionButton;