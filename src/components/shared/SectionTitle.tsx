// src/components/shared/SectionTitle.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

interface SectionTitleProps {
    children: React.ReactNode;
    action?: {
        label: string;
        onPress: () => void;
    };
}

export function SectionTitle({ children, action }: SectionTitleProps) {

    return (
        <View style={tw`flex-row items-center justify-between mb-4`}>
            <Text
                style={tw`text-lg font-semibold text-gray-900`}
            >
                {children}
            </Text>

            {action && (
                <TouchableOpacity onPress={action.onPress}>
                    <Text
                        style={tw`text-sm font-semibold text-blue-600 text-blue-600`}
                    >
                        {action.label}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

// Usage examples:
/*
// Basic usage
<SectionTitle>Currently Reading</SectionTitle>

// With action button
<SectionTitle 
  action={{
    label: "See All",
    onPress: () => router.push('/library')
  }}
>
  My Library
</SectionTitle>
*/