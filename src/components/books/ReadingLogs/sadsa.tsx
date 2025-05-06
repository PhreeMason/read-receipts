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

const feelsWithEmoji = [
    { name: 'swooning', emoji: '😍' },
    { name: 'butterflies', emoji: '🦋' },
    { name: 'hot & bothered', emoji: '🔥' },
    { name: 'intrigued', emoji: '🤔' },
    { name: 'mind-blown', emoji: '🤯' },
    { name: 'tense', emoji: '😬' },
    { name: 'teary-eyed', emoji: '😢' },
    { name: 'worried', emoji: '😟' },
    { name: 'reflective', emoji: '🤔' },
    { name: 'bored', emoji: '😴' },
    { name: 'thrilled', emoji: '😃' },
    { name: 'irritated', emoji: '😠' },
]

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
]);

const formSchema = z.object({
    format: z.array(z.enum(['physical', 'ebook', 'audio'])).min(1),
    date: z.date(),
    startPage: z.coerce.number().int().min(1).optional(),
    endPage: z.coerce.number().int().min(1).optional(),
    currentHours: z.coerce.number().int().min(0),
    currentMinutes: z.coerce.number().int().min(0).max(59),
    emotionalState: z.array(feels).optional(),
    note: z.string().optional(),
    duration: z.coerce.number().int().min(0).optional(),
    listeningSpeed: z.coerce.number().min(0.5).max(3).optional(),
    rating: z.coerce.number().int().min(0).max(5).optional(),
    currentPercentage: z.coerce.number().int().min(0).max(100).optional(),
});

type FormData = z.infer<typeof formSchema>;

// Helper Components
const FormError = ({ error }) => {
    if (!error) return null;
    return <Text style={tw`text-red-500 text-sm mt-1`}>{error.message}</Text>;
};

const StepIndicator = ({ index, currentStep, title }) => {
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
};

const FormatSelector = ({ format, selected, onToggle }) => (
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

const DateSelector = ({ date, onChange, error }) => {
    const [showPicker, setShowPicker] = useState(false);

    const onDateChange = (event, selectedDate) => {
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

const PhysicalBookProgress = ({ control, errors, startPage, endPage }) => (
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

const AudiobookProgress = ({ control, errors, currentHours, currentMinutes, listeningSpeed }) => (
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

        {currentHours > 0 || currentMinutes > 0 ? (
            <View style={tw`p-3 bg-gray-100 rounded-lg mb-4`}>
                <Text style={tw`text-center`}>
                    {`Effective listening time: ${((currentHours * 60 + currentMinutes) * listeningSpeed).toFixed(0)} minutes at ${listeningSpeed}x speed`}
                </Text>
            </View>
        ) : null}
    </View>
);

const EmotionSelector = ({ emotions, selectedEmotions, onChange, error }) => {
    const toggleEmotion = (emotion) => {
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

const NotesInput = ({ control, error }) => (
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

const RatingSelector = ({ control, value, error }) => (
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

const SessionSummary = ({ data, feelsWithEmoji }) => {
    // Map emotion names to emojis
    const emotionEmojis = data.emotionalState?.map(emotion => {
        const found = feelsWithEmoji.find(e => e.name === emotion);
        return found ? `${found.emoji} ${emotion}` : emotion;
    }).join(', ');

    const isAudiobook = data.format.includes('audio');

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

            {!isAudiobook && data.startPage && data.endPage && (
                <View style={tw`flex-row justify-between mb-2`}>
                    <Text style={tw`font-semibold`}>Pages:</Text>
                    <Text>{data.startPage} - {data.endPage} ({data.endPage - data.startPage} pages)</Text>
                </View>
            )}

            {isAudiobook && (data.currentHours > 0 || data.currentMinutes > 0) && (
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

            {data.emotionalState && data.emotionalState.length > 0 && (
                <View style={tw`flex-row justify-between mb-2`}>
                    <Text style={tw`font-semibold`}>Feelings:</Text>
                    <Text style={tw`flex-shrink text-right`}>{emotionEmojis}</Text>
                </View>
            )}

            {data.rating > 0 && (
                <View style={tw`flex-row justify-between mb-2`}>
                    <Text style={tw`font-semibold`}>Rating:</Text>
                    <Text>{'★'.repeat(data.rating)}</Text>
                </View>
            )}

            {data.note && (
                <View style={tw`mb-2`}>
                    <Text style={tw`font-semibold mb-1`}>Notes:</Text>
                    <Text style={tw`bg-gray-50 p-2 rounded`}>{data.note}</Text>
                </View>
            )}
        </View>
    );
};

const ReadingLogsForm = () => {
    const { data: lastReadingLog, isLoading } = useGetReadingLogs('last');
    const [currentStep, setCurrentStep] = useState(0);

    // Form steps configuration
    const formSteps = [
        { title: "Format", description: "Select format and date" },
        { title: "Progress", description: "Update your reading progress" },
        { title: "Experience", description: "How did this session make you feel?" },
        { title: "Review", description: "Review and submit your session" }
    ];

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
        trigger
    } = useForm<FormData>({
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

    // Update default values with last reading log
    useEffect(() => {
        if (lastReadingLog && !isLoading) {
            reset({
                ...lastReadingLog,
                startPage: lastReadingLog.endPage || 0,
                date: new Date(),
                note: '',
                rating: 0,
                emotionalState: []
            });
        }
    }, [lastReadingLog, isLoading, reset]);

    const onSubmit = (data: FormData) => {
        console.log('Form Data:', data);
        // Handle form submission - e.g., save to database, display success message
        // You could add API calls here
    };

    // Helper function to toggle formats
    const toggleFormat = (format, currentFormats, onChange) => {
        if (currentFormats.includes(format)) {
            // Don't allow removing the last format
            if (currentFormats.length > 1) {
                onChange(currentFormats.filter(f => f !== format));
            }
        } else {
            onChange([...currentFormats, format]);
        }
    };

    // Get validation fields based on current step
    const getFieldsToValidateForStep = (step) => {
        switch (step) {
            case 0:
                return ['format', 'date'];
            case 1:
                return watch('format').includes('audio')
                    ? ['currentHours', 'currentMinutes', 'listeningSpeed']
                    : ['startPage', 'endPage'];
            case 2:
                return ['emotionalState', 'note', 'rating'];
            default:
                return [];
        }
    };

    // Functions to navigate between steps
    const nextStep = async () => {
        const fieldsToValidate = getFieldsToValidateForStep(currentStep);
        const result = await trigger(fieldsToValidate);

        if (result) {
            setCurrentStep(Math.min(currentStep + 1, formSteps.length - 1));
        }
    };

    const prevStep = () => {
        setCurrentStep(Math.max(currentStep - 1, 0));
    };

    // Determine if the book is physical/ebook or audiobook
    const format = watch('format') || [];
    const isPhysicalOrEbook = format.includes('physical') || format.includes('ebook');
    const isAudiobook = format.includes('audio');

    // Render different form sections based on current step
    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <View style={tw`px-4`}>
                        <Text style={tw`text-lg font-semibold mb-4`}>What format are you reading?</Text>

                        <Controller
                            control={control}
                            name="format"
                            render={({ field: { onChange, value } }) => (
                                <View style={tw`mb-4`}>
                                    {['physical', 'ebook', 'audio'].map((format) => (
                                        <FormatSelector
                                            key={format}
                                            format={format}
                                            selected={value.includes(format)}
                                            onToggle={() => toggleFormat(format, value, onChange)}
                                        />
                                    ))}
                                    <FormError error={errors.format} />
                                </View>
                            )}
                        />

                        <Text style={tw`text-lg font-semibold mb-4 mt-2`}>When did you read?</Text>

                        <Controller
                            control={control}
                            name="date"
                            render={({ field: { onChange, value } }) => (
                                <DateSelector
                                    date={value}
                                    onChange={onChange}
                                    error={errors.date}
                                />
                            )}
                        />
                    </View>
                );
            case 1:
                return (
                    <View style={tw`px-4`}>
                        {isPhysicalOrEbook && (
                            <PhysicalBookProgress
                                control={control}
                                errors={errors}
                                startPage={watch('startPage')}
                                endPage={watch('endPage')}
                            />
                        )}

                        {isAudiobook && (
                            <AudiobookProgress
                                control={control}
                                errors={errors}
                                currentHours={watch('currentHours')}
                                currentMinutes={watch('currentMinutes')}
                                listeningSpeed={watch('listeningSpeed')}
                            />
                        )}
                    </View>
                );
            case 2:
                return (
                    <View style={tw`px-4`}>
                        <Text style={tw`text-lg font-semibold mb-4`}>How did this session make you feel?</Text>

                        <Controller
                            control={control}
                            name="emotionalState"
                            render={({ field: { onChange, value } }) => (
                                <EmotionSelector
                                    emotions={feelsWithEmoji}
                                    selectedEmotions={value || []}
                                    onChange={onChange}
                                    error={errors.emotionalState}
                                />
                            )}
                        />

                        <NotesInput
                            control={control}
                            error={errors.note}
                        />

                        <RatingSelector
                            control={control}
                            value={watch('rating')}
                            error={errors.rating}
                        />
                    </View>
                );
            case 3:
                return (
                    <View style={tw`px-4`}>
                        <Text style={tw`text-lg font-semibold mb-4`}>Review Your Session</Text>

                        <View style={tw`bg-gray-50 p-4 rounded-lg mb-4`}>
                            <SessionSummary data={watch()} feelsWithEmoji={feelsWithEmoji} />
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white pt-4`}>
            <ScrollView style={tw`flex-1`}>
                {/* Step indicator */}
                <View style={tw`flex-row justify-between mb-6 px-4`}>
                    {formSteps.map((step, index) => (
                        <StepIndicator
                            key={index}
                            index={index}
                            currentStep={currentStep}
                            title={step.title}
                        />
                    ))}
                </View>

                {/* Step title */}
                <View style={tw`px-4 mb-6`}>
                    <Text style={tw`text-2xl font-bold`}>{formSteps[currentStep].title}</Text>
                    <Text style={tw`text-gray-600`}>{formSteps[currentStep].description}</Text>
                </View>

                {/* Step content */}
                {renderCurrentStep()}

                {/* Navigation buttons */}
                <View style={tw`flex-row justify-between p-4 mt-4`}>
                    {currentStep > 0 ? (
                        <Button title="Previous" onPress={prevStep} />
                    ) : (
                        <View />
                    )}

                    {currentStep < formSteps.length - 1 ? (
                        <Button title="Next" onPress={nextStep} />
                    ) : (
                        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ReadingLogsForm;

// TODO: Format(s)
// TODO: remove effective listening time
// TODO: put audio start time and audio end time
// TODO: Feelings should be 3 per row