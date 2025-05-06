import { View, Text, TextInput, TouchableOpacity, ScrollView, Button, Platform } from 'react-native';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import tw from 'twrnc';
import React, { useEffect, useState } from 'react'
import { useGetReadingLogs } from '@/hooks/useBooks';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';


const BookFormat = ["physical", "ebook", "audio"] as const; // Runtime value
type BookFormat = (typeof BookFormat)[number]; // TypeScript type

// Define the union type for emotional states
type EmotionalState =
    | "swooning"
    | "butterflies"
    | "hot & bothered"
    | "intrigued"
    | "mind-blown"
    | "tense"
    | "teary-eyed"
    | "worried"
    | "reflective"
    | "bored"
    | "thrilled"
    | "irritated";

// Define the structure of each emotion
interface Feel {
    name: EmotionalState;
    emoji: string;
}

// Example feelsWithEmoji array
const feelsWithEmoji: Feel[] = [
    { name: "swooning", emoji: "😍" },
    { name: "butterflies", emoji: "🦋" },
    { name: "hot & bothered", emoji: "🔥" },
    { name: "intrigued", emoji: "🤔" },
    { name: "mind-blown", emoji: "🤯" },
    { name: "tense", emoji: "😬" },
    { name: "teary-eyed", emoji: "😢" },
    { name: "worried", emoji: "😟" },
    { name: "reflective", emoji: "🤔" },
    { name: "bored", emoji: "😐" },
    { name: "thrilled", emoji: "😄" },
    { name: "irritated", emoji: "😠" },
];

const feels = z.enum([
    'swooning',
    'butterflies',
    'hot & bothered',
    'intrigued',
    'mind-blown',
    'tense',
    'teary-eyed',
    'worried',
    'reflective',
    'bored',
    'thrilled',
    'irritated',
])

const formSchema = z.object({
    format: z.array(z.enum(BookFormat)).min(1),
    date: z.date(),
    startPage: z.coerce.number().int().min(1).optional(),
    endPage: z.coerce.number().int().min(1).optional(),
    currentHours: z.coerce.number().int().min(0),
    currentMinutes: z.coerce.number().int().min(0).max(59),
    emotionalState: z.array(feels).optional(),
    note: z.string().optional(),
    duration: z.coerce.number().int().min(0).optional(),
    listeningSpeed: z.coerce.number().nonnegative().optional(),
    rating: z.coerce.number().int().min(0).max(5).optional(),
    currentPercentage: z.coerce.number().int().min(0).max(100).optional(),
});

type FormData = z.infer<typeof formSchema>;

const ReadingLogsForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const { data: lastReadingLog, isLoading } = useGetReadingLogs('last');
    const { control, setValue, handleSubmit, formState: { errors }, watch, reset, trigger } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            format: ['physical'],
            date: new Date(),
            startPage: 0,
            endPage: 0,
            currentHours: 0,
            currentMinutes: 0,
            emotionalState: [],
            note: '',
            duration: 0,
            listeningSpeed: 1,
            rating: 0,
            currentPercentage: 0
        }
    });
    const formats: BookFormat[] = ["physical", "ebook", "audio"]; // Explicitly typed array

    // Watch the format to show conditional fields
    const selectedFormat = watch('format') || [];
    const isPhysical = selectedFormat.includes('physical') || selectedFormat.includes('ebook');
    const isAudio = selectedFormat.includes('audio');

    // Update default values with last reading log
    useEffect(() => {
        if (lastReadingLog && !isLoading) {
            reset({
                ...lastReadingLog,
                startPage: lastReadingLog.endPage || 0,
                date: new Date(),
                note: '',
                rating: 0
            });
        }
    }, [lastReadingLog, isLoading, reset]);

    const onSubmit = (data: FormData) => {
        console.log('Form Data:', data);
        // Handle form submission - you would call your API here
        alert('Reading session logged successfully!');
        reset();
        setCurrentStep(1);
    };

    const goToNextStep = async () => {
        let fieldsToValidate: Array<keyof FormData> = [];

        // Determine which fields to validate based on current step
        if (currentStep === 1) {
            fieldsToValidate = ['format', 'date'];
        } else if (currentStep === 2) {
            if (isPhysical) {
                fieldsToValidate = ['startPage', 'endPage'];
            }
            if (isAudio) {
                fieldsToValidate = ['duration', 'listeningSpeed'];
            }
            fieldsToValidate.push('currentHours', 'currentMinutes');
        }

        // Validate the fields for current step
        const isValid = await trigger(fieldsToValidate);
        if (isValid) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const goToPrevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    // Format selection component
    const FormatSelection = () => (
        <View style={tw`mb-4`}>
            <Text style={tw`text-lg font-bold mb-2`}>Format</Text>
            <View style={tw`flex-row flex-wrap`}>
                {formats.map(format => (
                    <Controller
                        key={format}
                        control={control}
                        name="format"
                        render={({ field }) => (
                            <TouchableOpacity
                                style={tw`mr-2 mb-2 p-3 rounded-lg ${(field.value || []).includes(format) ? 'bg-blue-500' : 'bg-gray-200'}`}
                                onPress={() => {
                                    const currentValue = field.value || [];
                                    if (currentValue.includes(format)) {
                                        // Remove if already selected
                                        field.onChange(currentValue.filter(item => item !== format));
                                    } else {
                                        // Add if not selected
                                        field.onChange([...currentValue, format]);
                                    }
                                }}
                            >
                                <Text style={tw`${(field.value || []).includes(format) ? 'text-white' : 'text-gray-800'}`}>
                                    {format.charAt(0).toUpperCase() + format.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />

                ))}
            </View>
            {errors.format && <Text style={tw`text-red-500 mt-1`}>Please select at least one format</Text>}
        </View>
    );

    // Date picker component
    const DateSelection = () => {
        const [showDatePicker, setShowDatePicker] = useState(false);
        return (
            <View style={tw`mb-4`}>
                <Text style={tw`text-lg font-bold mb-2`}>Date</Text>
                <Controller
                    control={control}
                    name="date"
                    render={({ field }) => (
                        <>
                            <TouchableOpacity
                                style={tw`border border-gray-300 p-3 rounded-lg`}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text>{field.value.toLocaleDateString()}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={field.value}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (selectedDate) {
                                            field.onChange(selectedDate);
                                        }
                                    }}
                                />
                            )}
                        </>
                    )}
                />
            </View>
        );
    };

    // Progress tracking component
    const ProgressTracking = () => (
        <View style={tw`mb-4`}>
            <Text style={tw`text-lg font-bold mb-4`}>Progress Tracking</Text>

            {isPhysical && (
                <View style={tw`mb-4`}>
                    <Text style={tw`font-bold mb-2`}>Page Progress</Text>
                    <View style={tw`flex-row mb-2`}>
                        <View style={tw`flex-1 mr-2`}>
                            <Text>Start Page</Text>
                            <Controller
                                control={control}
                                name="startPage"
                                render={({ field }) => (
                                    <TextInput
                                        style={tw`border border-gray-300 p-2 rounded-lg mt-1`}
                                        keyboardType="numeric"
                                        value={field.value?.toString() || ''}
                                        onChangeText={field.onChange}
                                    />
                                )}
                            />
                            {errors.startPage && <Text style={tw`text-red-500 mt-1`}>{errors.startPage.message}</Text>}
                        </View>
                        <View style={tw`flex-1`}>
                            <Text>End Page</Text>
                            <Controller
                                control={control}
                                name="endPage"
                                render={({ field }) => (
                                    <TextInput
                                        style={tw`border border-gray-300 p-2 rounded-lg mt-1`}
                                        keyboardType="numeric"
                                        value={field.value?.toString() || ''}
                                        onChangeText={field.onChange}
                                    />
                                )}
                            />
                            {errors.endPage && <Text style={tw`text-red-500 mt-1`}>{errors.endPage.message}</Text>}
                        </View>
                    </View>

                    <Text style={tw`font-bold mb-2`}>Current Percentage (optional)</Text>
                    <Controller
                        control={control}
                        name="currentPercentage"
                        render={({ field }) => (
                            <TextInput
                                style={tw`border border-gray-300 p-2 rounded-lg mb-2`}
                                keyboardType="numeric"
                                value={field.value?.toString() || ''}
                                onChangeText={field.onChange}
                                placeholder="0-100"
                            />
                        )}
                    />
                    {errors.currentPercentage && <Text style={tw`text-red-500 mb-2`}>{errors.currentPercentage.message}</Text>}
                </View>
            )}

            {isAudio && (
                <View style={tw`mb-4`}>
                    <Text style={tw`font-bold mb-2`}>Listening Duration (minutes)</Text>
                    <Controller
                        control={control}
                        name="duration"
                        render={({ field }) => (
                            <TextInput
                                style={tw`border border-gray-300 p-2 rounded-lg mb-2`}
                                keyboardType="numeric"
                                value={field.value?.toString() || ''}
                                onChangeText={field.onChange}
                            />
                        )}
                    />
                    {errors.duration && <Text style={tw`text-red-500 mb-2`}>{errors.duration.message}</Text>}

                    <Text style={tw`font-bold mb-2`}>Listening Speed</Text>
                    <Controller
                        control={control}
                        name="listeningSpeed"
                        render={({ field }) => (
                            <View style={tw`flex-row items-center`}>
                                <TouchableOpacity
                                    style={tw`bg-gray-200 p-2 rounded-l-lg`}
                                    onPress={() => {
                                        const newValue = Math.max(0.5, (field.value || 1) - 0.25);
                                        field.onChange(newValue);
                                    }}
                                >
                                    <Text>-</Text>
                                </TouchableOpacity>
                                <TextInput
                                    style={tw`border border-gray-300 p-2 text-center w-16`}
                                    keyboardType="numeric"
                                    value={field.value?.toString() || '1'}
                                    onChangeText={field.onChange}
                                />
                                <TouchableOpacity
                                    style={tw`bg-gray-200 p-2 rounded-r-lg`}
                                    onPress={() => {
                                        const newValue = Math.min(3, (field.value || 1) + 0.25);
                                        field.onChange(newValue);
                                    }}
                                >
                                    <Text>+</Text>
                                </TouchableOpacity>
                                <Text style={tw`ml-2`}>x</Text>
                            </View>
                        )}
                    />
                    {errors.listeningSpeed && <Text style={tw`text-red-500 mt-1`}>{errors.listeningSpeed.message}</Text>}
                </View>
            )}

            <Text style={tw`font-bold mb-2`}>Current Position (hours/minutes)</Text>
            <View style={tw`flex-row`}>
                <View style={tw`flex-1 mr-2`}>
                    <Text>Hours</Text>
                    <Controller
                        control={control}
                        name="currentHours"
                        render={({ field }) => (
                            <TextInput
                                style={tw`border border-gray-300 p-2 rounded-lg mt-1`}
                                keyboardType="numeric"
                                value={field.value?.toString() || ''}
                                onChangeText={field.onChange}
                            />
                        )}
                    />
                    {errors.currentHours && <Text style={tw`text-red-500 mt-1`}>{errors.currentHours.message}</Text>}
                </View>
                <View style={tw`flex-1`}>
                    <Text>Minutes</Text>
                    <Controller
                        control={control}
                        name="currentMinutes"
                        render={({ field }) => (
                            <TextInput
                                style={tw`border border-gray-300 p-2 rounded-lg mt-1`}
                                keyboardType="numeric"
                                value={field.value?.toString() || ''}
                                onChangeText={field.onChange}
                            />
                        )}
                    />
                    {errors.currentMinutes && <Text style={tw`text-red-500 mt-1`}>{errors.currentMinutes.message}</Text>}
                </View>
            </View>
        </View>
    );

    // Mood and notes component
    const MoodAndNotes = () => (
        <View style={tw`mb-4`}>
            <Text style={tw`text-lg font-bold mb-4`}>How did it make you feel?</Text>

            <View style={tw`flex-row flex-wrap mb-4`}>
                <Controller
                    control={control}
                    name="emotionalState"
                    render={({ field }) => (
                        <>
                            {feelsWithEmoji.map(feel => (
                                <TouchableOpacity
                                    key={feel.name}
                                    style={tw`mr-2 mb-2 p-3 rounded-lg ${field.value?.includes(feel.name) ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    onPress={() => {
                                        if (field.value?.includes(feel.name)) {
                                            field.onChange(field.value.filter(item => item !== feel.name));
                                        } else {
                                            field.onChange([...(field.value || []), feel.name]);
                                        }
                                    }}
                                >
                                    <Text style={tw`text-center`}>{feel.emoji}</Text>
                                    <Text style={tw`text-center text-xs mt-1 ${field.value?.includes(feel.name) ? 'text-white' : 'text-gray-800'}`}>
                                        {feel.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </>
                    )}
                />
            </View>

            <Text style={tw`font-bold mb-2`}>Notes</Text>
            <Controller
                control={control}
                name="note"
                render={({ field }) => (
                    <TextInput
                        style={tw`border border-gray-300 p-2 rounded-lg h-32`}
                        multiline
                        textAlignVertical="top"
                        value={field.value || ''}
                        onChangeText={field.onChange}
                        placeholder="Any thoughts about this reading session..."
                    />
                )}
            />

            <Text style={tw`font-bold mb-2 mt-4`}>Rating</Text>
            <Controller
                control={control}
                name="rating"
                render={({ field }) => (
                    <View style={tw`flex-row justify-between mb-4`}>
                        {[0, 1, 2, 3, 4, 5].map(rating => (
                            <TouchableOpacity
                                key={rating}
                                style={tw`p-2 ${field.value === rating ? 'bg-yellow-400' : 'bg-gray-200'} rounded-full w-10 h-10 flex items-center justify-center`}
                                onPress={() => field.onChange(rating)}
                            >
                                <Text style={tw`text-center`}>{rating}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            />
        </View>
    );

    // Review and submit component
    const ReviewAndSubmit = () => {
        const format = watch('format');
        const date = watch('date');
        const startPage = watch('startPage');
        const endPage = watch('endPage');
        const currentHours = watch('currentHours');
        const currentMinutes = watch('currentMinutes');
        const emotionalState = watch('emotionalState') || [];
        const note = watch('note');
        const duration = watch('duration');
        const listeningSpeed = watch('listeningSpeed');
        const rating = watch('rating');
        const currentPercentage = watch('currentPercentage');

        return (
            <View style={tw`mb-4`}>
                <Text style={tw`text-lg font-bold mb-4`}>Review Your Reading Log</Text>

                <View style={tw`bg-gray-100 p-4 rounded-lg mb-4`}>
                    <Text style={tw`font-bold mb-2`}>Format:</Text>
                    <Text style={tw`mb-3`}>{format.join(', ')}</Text>

                    <Text style={tw`font-bold mb-2`}>Date:</Text>
                    <Text style={tw`mb-3`}>{date.toLocaleDateString()}</Text>

                    {isPhysical && (
                        <>
                            <Text style={tw`font-bold mb-2`}>Pages Read:</Text>
                            <Text style={tw`mb-3`}>{startPage} to {endPage} ({endPage - startPage} pages)</Text>

                            {currentPercentage !== undefined && currentPercentage > 0 && (
                                <>
                                    <Text style={tw`font-bold mb-2`}>Current Percentage:</Text>
                                    <Text style={tw`mb-3`}>{currentPercentage}%</Text>
                                </>
                            )}
                        </>
                    )}

                    {isAudio && (
                        <>
                            <Text style={tw`font-bold mb-2`}>Listened For:</Text>
                            <Text style={tw`mb-3`}>{duration} minutes at {listeningSpeed}x speed</Text>
                        </>
                    )}

                    <Text style={tw`font-bold mb-2`}>Current Position:</Text>
                    <Text style={tw`mb-3`}>{currentHours}h {currentMinutes}m</Text>

                    {emotionalState.length > 0 && (
                        <>
                            <Text style={tw`font-bold mb-2`}>How You Felt:</Text>
                            <View style={tw`flex-row flex-wrap mb-3`}>
                                {emotionalState.map(feel => {
                                    const feelObj = feelsWithEmoji.find(f => f.name === feel);
                                    return (
                                        <Text key={feel} style={tw`mr-2 mb-1`}>
                                            {feelObj?.emoji} {feel}
                                        </Text>
                                    );
                                })}
                            </View>
                        </>
                    )}

                    {note && (
                        <>
                            <Text style={tw`font-bold mb-2`}>Notes:</Text>
                            <Text style={tw`mb-3`}>{note}</Text>
                        </>
                    )}

                    <Text style={tw`font-bold mb-2`}>Rating:</Text>
                    <Text style={tw`mb-3`}>{rating}/5</Text>
                </View>
            </View>
        );
    };

    // Step indicator
    const StepIndicator = () => (
        <View style={tw`flex-row justify-between mb-6`}>
            {[1, 2, 3, 4].map(step => (
                <View key={step} style={tw`items-center`}>
                    <View
                        style={tw`w-8 h-8 rounded-full ${currentStep === step ? 'bg-blue-500' :
                            currentStep > step ? 'bg-green-500' : 'bg-gray-300'
                            } items-center justify-center`}
                    >
                        <Text style={tw`text-white font-bold`}>{step}</Text>
                    </View>
                    <Text style={tw`text-xs mt-1`}>
                        {step === 1 ? 'Format' :
                            step === 2 ? 'Progress' :
                                step === 3 ? 'Feelings' : 'Review'}
                    </Text>
                </View>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <ScrollView style={tw`p-4`}>
                <Text style={tw`text-2xl font-bold mb-6 text-center`}>Reading Log</Text>

                <StepIndicator />

                {currentStep === 1 && (
                    <>
                        <FormatSelection />
                        <DateSelection />
                    </>
                )}

                {currentStep === 2 && (
                    <ProgressTracking />
                )}

                {currentStep === 3 && (
                    <MoodAndNotes />
                )}

                {currentStep === 4 && (
                    <ReviewAndSubmit />
                )}

                <View style={tw`flex-row justify-between mt-6 mb-10`}>
                    {currentStep > 1 && (
                        <TouchableOpacity
                            style={tw`bg-gray-300 px-6 py-3 rounded-lg`}
                            onPress={goToPrevStep}
                        >
                            <Text style={tw`font-bold`}>Back</Text>
                        </TouchableOpacity>
                    )}

                    {currentStep < 4 ? (
                        <TouchableOpacity
                            style={tw`bg-blue-500 px-6 py-3 rounded-lg ml-auto`}
                            onPress={goToNextStep}
                        >
                            <Text style={tw`font-bold text-white`}>Next</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={tw`bg-green-500 px-6 py-3 rounded-lg ml-auto`}
                            onPress={handleSubmit(onSubmit)}
                        >
                            <Text style={tw`font-bold text-white`}>Submit Log</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ReadingLogsForm
