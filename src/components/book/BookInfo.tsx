import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { ContinueReadingButton } from '@/components/home/CurrentlyReadingSection/ContinueReadingButton';

interface BookInfoProps {
    title: string;
    author: string;
    progress: number | null;
    onContinuePress: () => void;
}

export function BookInfo({
    title,
    author,
    progress,
    onContinuePress
}: BookInfoProps) {
    return (
        <View style={tw`p-4 gap-2`}>
            <View>
                <Text
                    numberOfLines={1}
                    style={tw`font-semibold text-gray-900`}
                >
                    {title}
                </Text>
                <Text
                    numberOfLines={1}
                    style={tw`text-sm text-gray-600`}
                >
                    {author}
                </Text>
            </View>

            <ProgressBar progress={progress || 0} />
            <ContinueReadingButton onPress={onContinuePress} />
        </View>
    );
}