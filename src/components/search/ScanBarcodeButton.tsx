import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import tw from 'twrnc';

type ScanBarcodeButtonProps = {
    onPress: () => void;
};

export const ScanBarcodeButton: React.FC<ScanBarcodeButtonProps> = ({ onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={tw`w-full flex-row items-center justify-center py-3 px-4 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-colors mb-6`}
        >
            <Svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8C6A5B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={tw`mr-2`}
            >
                <Path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <Path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <Path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <Path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <Line x1="8" y1="10" x2="8" y2="16" />
                <Line x1="12" y1="8" x2="12" y2="16" />
                <Line x1="16" y1="10" x2="16" y2="16" />
            </Svg>
            <Text style={tw`font-medium text-gray-900`}>Scan Book Barcode</Text>
        </TouchableOpacity>
    );
};