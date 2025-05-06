import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { Controller } from 'react-hook-form';
import tw from 'twrnc';
import React, { useState } from 'react';

type StepIndicatorProps = {
    index: number;
    currentStep: number;
    title: string;
}


export const StepIndicator: React.FC<StepIndicatorProps> = ({ index, currentStep, title }) => {
    const isActive = index === currentStep;
    const isCompleted = index < currentStep;

    return (
        <View style={tw`items-center`}>
            <View style={tw`
                w-8 h-8 rounded-full 
                ${isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-300'}
                items-center justify-center mb-1
            `}>
                {isCompleted ? (
                    <Text style={tw`text-white font-bold`}>✓</Text>
                ) : (
                    <Text style={tw`text-white font-bold`}>{index + 1}</Text>
                )}
            </View>
            <Text style={tw`text-xs text-center ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                {title}
            </Text>
        </View>
    );
}

type FormErrorProps = {
    error: { message?: string | undefined; } | undefined
}

export const FormError: React.FC<FormErrorProps> = ({ error }) => {
    if (!error) return null;
    return <Text style={tw`text-red-500 text-sm mt-1`}>{error.message}</Text>;
};

type FormatSelectorProps = {
    format: string | null;
    selected: boolean;
    onToggle: () => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({ format, selected, onToggle }) => (
    <TouchableOpacity
        style={tw`flex-row items-center p-3 border rounded-lg mb-2 ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        onPress={onToggle}
    >
        <View style={tw`w-6 h-6 border-2 rounded-full mr-3 items-center justify-center ${selected ? 'border-blue-500' : 'border-gray-400'}`}>
            {selected && <View style={tw`w-3 h-3 bg-blue-500 rounded-full`} />}
        </View>
        <Text style={tw`text-base capitalize`}>{format}</Text>
    </TouchableOpacity>
);

type DateSelectorProps = {
    date: Date;
    onChange: (date: Date) => void;
    error?: {
        message?: string;
    }
}

export const DateSelector: React.FC<DateSelectorProps> = ({ date, onChange, error }) => {
    const [showPicker, setShowPicker] = useState(false);

    const onDateChange = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
        setShowPicker(Platform.OS === 'ios');
        if (selectedDate) {
            onChange(selectedDate);
        }
    };

    return (
        <View style={tw`mb-4`}>
            <TouchableOpacity
                style={tw`p-3 border border-gray-300 rounded-lg`}
                onPress={() => setShowPicker(true)}
            >
                <Text>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    maximumDate={new Date()}
                />
            )}

            <FormError error={error} />
        </View>
    );
};

type PhysicalBookProgressProps = {
    control: any;
    errors: {
        startPage?: { message?: string };
        endPage?: { message?: string };
    };
    startPage?: number;
    endPage?: number;
};

export const PhysicalBookProgress: React.FC<PhysicalBookProgressProps> = ({ control, errors, startPage, endPage }) => (
    <View>
        <Text style={tw`text-lg font-semibold mb-4`}>Track Pages Read</Text>

        <View style={tw`mb-4`}>
            <Text style={tw`mb-2`}>Starting Page</Text>
            <Controller
                control={control}
                name="startPage"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={tw`p-3 border border-gray-300 rounded-lg`}
                        keyboardType="numeric"
                        value={value?.toString() || ''}
                        onChangeText={(text) => onChange(text)}
                        placeholder="0"
                    />
                )}
            />
            <FormError error={errors.startPage} />
        </View>

        <View style={tw`mb-4`}>
            <Text style={tw`mb-2`}>Ending Page</Text>
            <Controller
                control={control}
                name="endPage"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={tw`p-3 border border-gray-300 rounded-lg`}
                        keyboardType="numeric"
                        value={value?.toString() || ''}
                        onChangeText={(text) => onChange(text)}
                        placeholder="0"
                    />
                )}
            />
            <FormError error={errors.endPage} />
        </View>

        {startPage && endPage && endPage >= startPage && (
            <View style={tw`p-3 bg-gray-100 rounded-lg mb-4`}>
                <Text style={tw`text-center`}>
                    You read {endPage - startPage} pages in this session
                </Text>
            </View>
        )}
    </View>
);

type AudiobookProgressProps = {
    control: any;
    errors: {
        currentHours?: { message?: string };
        currentMinutes?: { message?: string };
        listeningSpeed?: { message?: string };
    };
    currentHours: number;
    currentMinutes: number;
    listeningSpeed?: number;
};

export const AudiobookProgress: React.FC<AudiobookProgressProps> = ({ control, errors, currentHours, currentMinutes, listeningSpeed }) => (
    <View>
        <Text style={tw`text-lg font-semibold mb-4`}>Track Listening Time</Text>

        <View style={tw`flex-row mb-4`}>
            <View style={tw`flex-1 mr-2`}>
                <Text style={tw`mb-2`}>Hours</Text>
                <Controller
                    control={control}
                    name="currentHours"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={tw`p-3 border border-gray-300 rounded-lg`}
                            keyboardType="numeric"
                            value={value?.toString() || ''}
                            onChangeText={(text) => onChange(text)}
                            placeholder="0"
                        />
                    )}
                />
                <FormError error={errors.currentHours} />
            </View>

            <View style={tw`flex-1 ml-2`}>
                <Text style={tw`mb-2`}>Minutes</Text>
                <Controller
                    control={control}
                    name="currentMinutes"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={tw`p-3 border border-gray-300 rounded-lg`}
                            keyboardType="numeric"
                            value={value?.toString() || ''}
                            onChangeText={(text) => onChange(text)}
                            placeholder="0"
                        />
                    )}
                />
                <FormError error={errors.currentMinutes} />
            </View>
        </View>

        <View style={tw`mb-4`}>
            <Text style={tw`mb-2`}>Listening Speed ({listeningSpeed}x)</Text>
            <Controller
                control={control}
                name="listeningSpeed"
                render={({ field: { onChange, value } }) => (
                    <Slider
                        style={tw`h-10 w-full`}
                        minimumValue={0.5}
                        maximumValue={2.5}
                        step={0.25}
                        value={value}
                        onValueChange={onChange}
                        minimumTrackTintColor="#007AFF"
                        maximumTrackTintColor="#DDDDDD"
                    />
                )}
            />
            <FormError error={errors.listeningSpeed} />
        </View>
    </View>
);

type Emotion = {
    name: string;
    emoji: string;
};

type EmotionSelectorProps = {
    emotions: Emotion[]; // Array of emotions with name and emoji
    selectedEmotions: string[]; // Array of selected emotion names
    onChange: (selectedEmotions: string[]) => void; // Callback to handle changes in selected emotions
    error?: { message?: string }; // Optional error object
};

export const EmotionSelector: React.FC<EmotionSelectorProps> = ({ emotions, selectedEmotions, onChange, error }) => {
    const toggleEmotion = (emotion: string) => {
        if (selectedEmotions.includes(emotion)) {
            onChange(selectedEmotions.filter(e => e !== emotion));
        } else {
            onChange([...selectedEmotions, emotion]);
        }
    };

    return (
        <View style={tw`mb-4`}>
            <View style={tw`flex-row flex-wrap mb-2`}>
                {emotions.map((feel) => (
                    <TouchableOpacity
                        key={feel.name}
                        style={tw`m-1 p-2 rounded-lg ${selectedEmotions.includes(feel.name) ? 'bg-blue-100 border border-blue-500' : 'bg-gray-100 border border-gray-300'}`}
                        onPress={() => toggleEmotion(feel.name)}
                    >
                        <Text style={tw`text-center text-xl`}>{feel.emoji}</Text>
                        <Text style={tw`text-center text-xs mt-1`}>{feel.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <FormError error={error} />
        </View>
    );
};

type NotesInputProps = {
    control: any;
    error?: { message?: string };
};

export const NotesInput: React.FC<NotesInputProps> = ({ control, error }) => (
    <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-semibold mb-2`}>Notes (optional)</Text>
        <Controller
            control={control}
            name="note"
            render={({ field: { onChange, value } }) => (
                <TextInput
                    style={tw`p-3 border border-gray-300 rounded-lg h-24`}
                    value={value || ''}
                    onChangeText={onChange}
                    placeholder="Add any thoughts or reflections..."
                    multiline
                />
            )}
        />
        <FormError error={error} />
    </View>
);

type RatingSelectorProps = {
    control: any;
    value?: number;
    error?: { message?: string };
};

export const RatingSelector: React.FC<RatingSelectorProps> = ({ control, value, error }) => (
    <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-semibold mb-2`}>Session Rating</Text>
        <Controller
            control={control}
            name="rating"
            render={({ field: { onChange, value } }) => (
                <View style={tw`flex-row justify-between`}>
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <TouchableOpacity
                            key={rating}
                            style={tw`items-center justify-center h-12 w-12 rounded-full ${value >= rating ? 'bg-yellow-400' : 'bg-gray-200'}`}
                            onPress={() => onChange(rating)}
                        >
                            <Text style={tw`text-lg`}>★</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        />
        <FormError error={error} />
    </View>
);

type SessionSummaryProps = {
    data: {
        format: string[];
        date: Date;
        startPage?: number;
        endPage?: number;
        currentHours?: number;
        currentMinutes?: number;
        listeningSpeed?: number;
        emotionalState?: string[];
        rating?: number;
        note?: string;
    };
    feelsWithEmoji: Emotion[];
};

export const SessionSummary: React.FC<SessionSummaryProps> = ({ data, feelsWithEmoji }) => {
    // Map emotion names to emojis
    const emotionEmojis = data.emotionalState?.map(emotion => {
        const found = feelsWithEmoji.find(e => e.name === emotion);
        return found ? `${found.emoji} ${emotion}` : emotion;
    }).join(', ');

    const isAudiobook = data.format.includes('audio');
    const { currentHours, currentMinutes } = data;

    return (
        <View>
            <View style={tw`flex-row justify-between mb-2`}>
                <Text style={tw`font-semibold`}>Format:</Text>
                <Text>{data.format.join(', ')}</Text>
            </View>

            <View style={tw`flex-row justify-between mb-2`}>
                <Text style={tw`font-semibold`}>Date:</Text>
                <Text>{data.date.toLocaleDateString()}</Text>
            </View>

            {!isAudiobook && data.startPage && data.endPage ? (
                <View style={tw`flex-row justify-between mb-2`}>
                    <Text style={tw`font-semibold`}>Pages:</Text>
                    <Text>{data.startPage} - {data.endPage} ({data.endPage - data.startPage} pages)</Text>
                </View>
            ) : null}
            {/* @ts-ignore */}
            {isAudiobook && (currentHours > 0 || currentMinutes > 0) && (
                <>
                    <View style={tw`flex-row justify-between mb-2`}>
                        <Text style={tw`font-semibold`}>Listening time:</Text>
                        <Text>{data.currentHours}h {data.currentMinutes}m</Text>
                    </View>
                    <View style={tw`flex-row justify-between mb-2`}>
                        <Text style={tw`font-semibold`}>Speed:</Text>
                        <Text>{data.listeningSpeed}x</Text>
                    </View>
                </>
            )}

            {data.emotionalState && data.emotionalState.length > 0 ? (
                <View style={tw`flex-row justify-between mb-2`}>
                    <Text style={tw`font-semibold`}>Feelings:</Text>
                    <Text style={tw`flex-shrink text-right`}>{emotionEmojis}</Text>
                </View>
            ) : null}

            {data.rating && data.rating > 0 ? (
                <View style={tw`flex-row justify-between mb-2`}>
                    <Text style={tw`font-semibold`}>Rating:</Text>
                    <Text>{'★'.repeat(data.rating)}</Text>
                </View>
            ) : null}

            {data.note ? (
                <View style={tw`mb-2`}>
                    <Text style={tw`font-semibold mb-1`}>Notes:</Text>
                    <Text style={tw`bg-gray-50 p-2 rounded`}>{data.note}</Text>
                </View>
            ) : null}
        </View>
    );
};