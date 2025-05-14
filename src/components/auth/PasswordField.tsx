import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import tw from 'twrnc';

const Eye = () => <Entypo name="eye" size={24} color="gray" />;
const EyeOff = () => <Entypo name="eye-with-line" size={24} color="gray" />;

interface PasswordFieldProps extends Omit<TextInputProps, 'className'> {
    error?: string;
    label?: string;
    helperText?: string;
}

export default function PasswordField({
    error,
    label = "Password",
    helperText,
    ...props
}: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={tw`gap-2`}>
            <Text style={tw`text-sm font-medium text-gray-700`}>{label}</Text>
            <View style={tw`relative`}>
                <TextInput
                    style={tw`p-4 border rounded-lg bg-white pr-12 ${error ? 'border-red-500' : 'border-gray-300'
                        }`}
                    autoCapitalize="none"
                    secureTextEntry={!showPassword}
                    {...props}
                />
                <TouchableOpacity
                    style={tw`absolute right-4 top-4`}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? (
                        <EyeOff />
                    ) : (
                        <Eye />
                    )}
                </TouchableOpacity>
            </View>
            {helperText && (
                <Text style={tw`text-xs text-gray-500`}>{helperText}</Text>
            )}
            {error && (
                <Text style={tw`text-sm text-red-500`}>{error}</Text>
            )}
        </View>
    );
}