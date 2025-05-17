import { View, Text, ScrollView, Button, TextInput } from 'react-native';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import tw from 'twrnc';
import React, { useEffect, useState } from 'react'
import { useGetReadingLogs } from '@/hooks/useBooks';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    DateSelector,
    FormatSelector,
    PhysicalBookProgress,
    AudiobookProgress,
    EmotionSelector,
    NotesInput,
    RatingSelector,
    SessionSummary,
    StepIndicator,
    FormError,
    ReadingLocation,
} from './form-components';
import type { BookFormat, BookReadingLogInsert } from '@/types/book';

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
    readingLocation: z.string().optional(),
    duration: z.coerce.number().int().min(0).optional(),
    listeningSpeed: z.coerce.number().min(0.5).max(3).optional(),
    rating: z.coerce.number().int().min(0).max(5).optional(),
    currentPercentage: z.coerce.number().int().min(0).max(100).optional(),
});

export type FormData = z.infer<typeof formSchema>;

type LogDataNoUserId = Omit<BookReadingLogInsert, 'user_id' | 'book_id' | 'id'>;

export function transformLogFormData(formData: FormData): LogDataNoUserId {
    // Handle audio time conversion only for audio format
    const audioEndTime = formData.format.includes('audio')
        ? (formData.currentHours * 60) + formData.currentMinutes
        : null;

    return {
        format: formData.format,
        date: formData.date.toISOString(),
        start_page: formData.startPage,
        end_page: formData.endPage,
        emotional_state: formData.emotionalState,
        note: formData.note,
        reading_location: formData.readingLocation,
        listening_speed: formData.listeningSpeed,
        rating: formData.rating,
        current_percentage: formData.currentPercentage,
        audio_end_time: audioEndTime,
        audio_start_time: formData.format.includes('audio') ? 0 : null
    };
}

// Helper Components

const ReadingLogsForm = () => {
    const { data: lastReadingLog, isLoading } = useGetReadingLogs('last');
    const [currentStep, setCurrentStep] = useState(0);
    const { prevHours, prevMinutes } = lastReadingLog || { prevHours: 0, prevMinutes: 0 };
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
        const transformedData = transformLogFormData(data);
        // Handle form submission - e.g., save to database, display success message
        // You could add API calls here
    };

    const toggleFormat = (
        format: BookFormat,
        currentFormats: BookFormat[],
        onChange: (formats: BookFormat[]) => void
    ) => {
        if (currentFormats.includes(format)) {
            if (currentFormats.length > 1) {
                onChange(currentFormats.filter(f => f !== format));
            }
        } else {
            onChange([...currentFormats, format]);
        }
    };

    // Get validation fields based on current step
    const getFieldsToValidateForStep = (step: number) => {
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
        // @ts-ignore argument of type 'string[]' is not assignable to parameter of type ...
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
                        <Text style={tw`text-lg font-semibold mb-4`}>What format(s) are you reading?</Text>

                        <Controller
                            control={control}
                            name="format"
                            render={({ field: { onChange, value } }) => (
                                <View style={tw`mb-4`}>
                                    {(["physical", "ebook", "audio"] as BookFormat[]).map((format) => (
                                        <FormatSelector
                                            key={format}
                                            format={format}
                                            // @ts-ignore 
                                            selected={(value || []).includes(format)}
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

                        <View style={tw`mb-4`}>
                            <Text style={tw`mb-2`}>Current Percentage</Text>
                            <Controller
                                control={control}
                                name="currentPercentage"
                                render={({ field: { onChange, value } }) => (
                                    <View style={tw`flex-row items-center`}>
                                        <TextInput
                                            style={tw`p-3 border border-gray-300 rounded-lg w-25`}
                                            keyboardType="numeric"
                                            value={value?.toString() || ''}
                                            onChangeText={(text) => onChange(text)}
                                            placeholder="0"
                                        />
                                        <Text style={tw`text-gray-500 text-lg ml-1`}>%</Text>
                                    </View>
                                )}
                            />
                            <FormError error={errors.currentPercentage} />
                        </View>

                        {isAudiobook && (
                            <AudiobookProgress
                                control={control}
                                errors={errors}
                                currentHours={watch('currentHours')}
                                currentMinutes={watch('currentMinutes')}
                                listeningSpeed={watch('listeningSpeed')}
                                prevHours={prevHours}
                                prevMinutes={prevMinutes}
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

                        <ReadingLocation
                            control={control}
                            error={errors.readingLocation}
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

// TODO: put audio start time and audio end time
// TODO: Feelings should be 3 per row