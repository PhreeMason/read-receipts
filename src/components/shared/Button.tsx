import React, { useState } from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    TouchableOpacityProps,
    View,
} from 'react-native';
import tw from 'twrnc';
interface ButtonProps extends TouchableOpacityProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    className?: string;
    textClassName?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}
export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className = '',
    textClassName = '',
    leftIcon,
    rightIcon,
    disabled,
    ...props
}: ButtonProps) {
    const [isPressed, setIsPressed] = useState(false);
    const baseClasses = 'flex-row items-center justify-center rounded-lg';
    const sizeClasses = {
        sm: 'px-3 py-2',
        md: 'px-4 py-3',
        lg: 'px-6 py-4',
    };
    const variantClasses = {
        primary: isPressed ? 'bg-blue-700' : 'bg-blue-600',
        secondary: isPressed ? 'bg-gray-300' : 'bg-gray-200',
        outline: `${isPressed ? 'bg-gray-50' : 'bg-white'} border border-gray-300`
    };
    const textBaseClasses = 'font-semibold text-center';
    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };
    const textVariantClasses = {
        primary: 'text-white',
        secondary: 'text-gray-900',
        outline: 'text-gray-900',
    };
    const buttonClasses = [
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        disabled || isLoading ? 'opacity-50' : '',
        className,
    ].join(' ').trim();
    const textClasses = [
        textBaseClasses,
        textSizeClasses[size],
        textVariantClasses[variant],
        textClassName,
    ];
    const spinnerColor = variant === 'primary' ? '#FFFFFF' : '#000000';
    return (
        <TouchableOpacity
            style={tw.style(buttonClasses)}
            disabled={disabled || isLoading}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator color={spinnerColor} style={tw`mr-2`} />
            ) : leftIcon ? (
                <View style={tw`mr-2`}>{leftIcon}</View>
            ) : null}
            <Text style={tw.style(textClasses)}>
                {children}
            </Text>
            {rightIcon && !isLoading && (
                <View style={tw`ml-2`}>{rightIcon}</View>
            )}
        </TouchableOpacity>
    );
}