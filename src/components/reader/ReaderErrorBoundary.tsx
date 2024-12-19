import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

interface ReaderErrorProps {
    error: Error;
    onRetry: () => void;
}

const ReaderError: React.FC<ReaderErrorProps> = ({ error, onRetry }) => (
    <View style={tw`flex-1 items-center justify-center p-4 bg-white`}>
        <Text style={tw`text-xl font-bold mb-2`}>Unable to Load Reader</Text>
        <Text style={tw`text-sm text-gray-600 mb-4 text-center`}>
            {error.message || 'There was an error loading the book reader'}
        </Text>
        <TouchableOpacity
            style={tw`bg-blue-500 px-4 py-2 rounded-lg`}
            onPress={onRetry}
        >
            <Text style={tw`text-white font-medium`}>Retry Loading</Text>
        </TouchableOpacity>
    </View>
);

export const ReaderErrorBoundary: React.FC<{
    children: React.ReactNode;
    onRetry: () => void;
}> = ({ children, onRetry }) => (
    <ErrorBoundary
        fallback={(
            <ReaderError
                error={new Error('Failed to load reader')}
                onRetry={onRetry}
            />
        )}
    >
        {children}
    </ErrorBoundary>
);