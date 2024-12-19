import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to your error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={tw`flex-1 items-center justify-center p-4`}>
          <Text style={tw`text-lg font-bold mb-2`}>Something went wrong</Text>
          <Text style={tw`text-sm text-gray-600 mb-4 text-center`}>
            {this.state.error?.message}
          </Text>
          <TouchableOpacity
            style={tw`bg-blue-500 px-4 py-2 rounded-lg`}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={tw`text-white font-medium`}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;