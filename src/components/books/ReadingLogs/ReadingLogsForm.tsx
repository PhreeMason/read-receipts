import { View, Text, ScrollView, Button, TextInput, TouchableOpacity } from 'react-native';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import tw from 'twrnc';
import React, { useEffect, useState } from 'react'
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
import type { BookFormat, BookReadingLogInsert, UserBook } from '@/types/book';
import { useLocalSearchParams } from 'expo-router';
import { useCreateReadingLog } from '@/hooks/useBooks';

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
    startPage: z.coerce.number().int().optional(),
    endPage: z.coerce.number().int().optional(),
    currentHours: z.coerce.number().int().min(0),
    currentMinutes: z.coerce.number().int().min(0).max(59),
    emotionalState: z.array(feels).optional(),
    note: z.string().optional(),
    readingLocation: z.string().optional(),
    duration: z.coerce.number().int().min(0).optional(),
    listeningSpeed: z.coerce.number().min(0.5).max(3).optional(),
    rating: z.coerce.number().int().min(0).max(5).optional(),
    currentPercentage: z.coerce.number().int().min(0).max(100).optional(),
}).superRefine((data, ctx) => {
    // Only validate pages if using physical/ebook format
    if (data.format.includes('physical') || data.format.includes('ebook')) {
        if (typeof data.startPage === 'undefined') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Start page is required for physical/ebook formats",
                path: ['startPage']
            });
        } else if (data.startPage < 1) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                minimum: 1,
                type: "number",
                inclusive: true,
                message: "Start page must be at least 1",
                path: ['startPage']
            });
        }

        if (typeof data.endPage !== 'undefined' && data.endPage < data.startPage) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "End page cannot be before start page",
                path: ['endPage']
            });
        }
    }
});;


export type FormData = z.infer<typeof formSchema>;

function extractFormDataFromLog(log: any): FormData {
    return {
        format: log.format ?? [],
        date: log.date ? new Date(log.date) : new Date(),
        startPage: typeof log.end_page === 'number' ? log.end_page : undefined,
        endPage: undefined,
        currentHours: typeof log.audio_end_time === 'number' ? Math.floor(log.audio_end_time / 60) : 0,
        currentMinutes: typeof log.audio_end_time === 'number' ? log.audio_end_time % 60 : 0,
        emotionalState: [],
        note: '',
        readingLocation: log.reading_location ?? '',
        duration: typeof log.duration === 'number' ? log.duration : 0,
        listeningSpeed: typeof log.listening_speed === 'number' ? log.listening_speed : 1,
        rating: 0,
        currentPercentage: typeof log.current_percentage === 'number' ? log.current_percentage : 0,
    };
}

type LogDataNoUserId = Omit<BookReadingLogInsert, 'user_id' | 'book_id' | 'id'>;

export function transformLogFormData(formData: FormData, lastReadingLog: BookReadingLogInsert | null): LogDataNoUserId {
    // Handle audio time conversion only for audio format
    const audioEndTime = formData.format.includes('audio')
        ? (formData.currentHours * 60) + formData.currentMinutes
        : null;
    const audioStartTime = formData.format.includes('audio')
        ? lastReadingLog?.audio_end_time ?? 0
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
        audio_start_time: audioStartTime,
    };
}

const formSteps = [
    { title: "Format", description: "Select format and date" },
    { title: "Progress", description: "Update your reading progress" },
    { title: "Experience", description: "" },
    { title: "Review", description: "Review and submit your session" }
];

// Helper Components

const ReadingLogsForm = ({
    userBook,
    readingLogs
}: {
    userBook?: UserBook | null;
    readingLogs?: BookReadingLogInsert[] | null;
}) => {
    const { api_id } = useLocalSearchParams();
    const [lastReadingLog, setlastReadingLog] = useState<BookReadingLogInsert | null>(null);
    const [availableFormats, setAvailableFormats] = useState<BookFormat[]>(['physical', 'ebook', 'audio']);
    const { mutate: createReadingLog } = useCreateReadingLog();

    const [currentStep, setCurrentStep] = useState(0);
    const { audio_end_time } = lastReadingLog ?? { audio_end_time: 0 };

    const prevHours = audio_end_time ? Math.floor(audio_end_time / 60) : 0;
    const prevMinutes = audio_end_time ? audio_end_time % 60 : 0;
    // Form steps configuration


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
        if (readingLogs && readingLogs.length > 0) {
            const lastLog = readingLogs[0];
            setlastReadingLog(lastLog);
            const logData = extractFormDataFromLog(lastLog);
            reset({
                ...logData,
                startPage: logData.endPage || 0,
                date: new Date(),
                note: '',
                rating: 0,
                emotionalState: []
            });
        }
        if (userBook && userBook.format) {
            const formats = userBook.format
            setAvailableFormats(formats);
        }
    }, [userBook, readingLogs, reset]);

    const onSubmit = (data: FormData) => {
        const transformedData = transformLogFormData(data, lastReadingLog);
        console.log({
            data,
            transformedData,
        });
        createReadingLog({
            // @ts-ignore
            readingLog: transformedData,
            bookId: userBook?.book_id,
        }, {
            onSuccess: () => {
                // Reset form and go back to the first step
                reset({
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
                });
                setCurrentStep(0);
            },
            onError: (error) => {
                console.error('Error creating reading log:', error);
            }
        })
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

    const format = watch('format') || [];
    const isPhysicalOrEbook = format.includes('physical') || format.includes('ebook');
    const isAudiobook = format.includes('audio');

    // Get validation fields based on current step
    const getFieldsToValidateForStep = (step: number) => {
        switch (step) {
            case 0:
                return ['format', 'date'];
            case 1:
                const bookFields = isPhysicalOrEbook ? ['startPage', 'endPage'] : [];
                const audiobookFields = isAudiobook ? ['currentHours', 'currentMinutes', 'listeningSpeed'] : [];
                return [...bookFields, ...audiobookFields, 'currentPercentage'];
            case 2:
                return ['emotionalState', 'note', 'rating'];
            default:
                return [];
        }
    };


    // Add these inside your component
    const totalPages = userBook?.total_pages || 0;
    const totalDuration = userBook?.total_duration || 0; // In minutes
    const [updateSource, setUpdateSource] = useState<'percentage' | 'page' | 'time'>();

    // Main synchronization useEffect
    // useEffect(() => {
    //     const subscription = watch((value, { name }) => {
    //         if (!name) return;

    //         // Prevent infinite loops
    //         if (name === 'currentPercentage' && updateSource !== 'percentage') {
    //             handlePercentageUpdate(value.currentPercentage || 0);
    //         }
    //         if (name === 'startPage' && updateSource !== 'page') {
    //             handlePageUpdate(value.startPage || 0);
    //         }
    //         if ((name === 'currentHours' || name === 'currentMinutes') && updateSource !== 'time') {
    //             handleTimeUpdate(value.currentHours || 0, value.currentMinutes || 0);
    //         }
    //     });

    //     return () => subscription.unsubscribe();
    // }, [watch, updateSource, totalPages, totalDuration]);

    // Helper functions
    const handlePercentageUpdate = (percentage: number) => {
        setUpdateSource('percentage');

        // Physical book calculation
        if (isPhysicalOrEbook && totalPages > 0) {
            const newPage = Math.round((percentage / 100) * totalPages);
            // setValue('startPage', newPage, { shouldValidate: true });
        }

        // Audiobook calculation
        if (isAudiobook && totalDuration > 0) {
            const totalMinutes = (percentage / 100) * totalDuration;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = Math.round(totalMinutes % 60);
            // setValue('currentHours', hours);
            // setValue('currentMinutes', minutes);
        }

        setTimeout(() => setUpdateSource(undefined), 100);
    };

    const handlePageUpdate = (page: number) => {
        setUpdateSource('page');

        if (totalPages > 0) {
            const newPercentage = Math.round((page / totalPages) * 100);
            // setValue('currentPercentage', newPercentage);

            if (isAudiobook && totalDuration > 0) {
                const totalMinutes = (newPercentage / 100) * totalDuration;
                const hours = Math.floor(totalMinutes / 60);
                const minutes = Math.round(totalMinutes % 60);
                // setValue('currentHours', hours);
                // setValue('currentMinutes', minutes);
            }
        }

        setTimeout(() => setUpdateSource(undefined), 100);
    };

    const handleTimeUpdate = (hours: number, minutes: number) => {
        setUpdateSource('time');

        if (totalDuration > 0) {
            const totalMinutes = hours * 60 + minutes;
            const newPercentage = Math.round((totalMinutes / totalDuration) * 100);
            // setValue('currentPercentage', newPercentage);

            if (isPhysicalOrEbook && totalPages > 0) {
                const newPage = Math.round((newPercentage / 100) * totalPages);
                // setValue('startPage', newPage);
            }
        }

        setTimeout(() => setUpdateSource(undefined), 100);
    };


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
                                    {(availableFormats).map((format) => (
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
                        <TouchableOpacity onPress={prevStep}>
                            <Text style={tw`text-blue-500`}>Previous</Text>
                        </TouchableOpacity>
                    ) : (
                        <View />
                    )}

                    {currentStep < formSteps.length - 1 ? (
                        <TouchableOpacity onPress={nextStep}>
                            <Text style={tw`text-blue-500`}>Next</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity

                            onPress={handleSubmit(
                                onSubmit,
                                errors => console.log("Form errors:", errors)
                            )}>
                            <Text style={tw`text-blue-500`}>Submit</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ReadingLogsForm;

// TODO: put audio start time and audio end time
// TODO: Feelings should be 3 per row
// Format:
// ebook, audio
// Date:
// 5 / 18 / 2025
// Listening time:
// 0h 28m
// Speed:
// 1x
// Location:
// In the shower 🚿
// Feelings:
// 🤔 reflective, 🤔 intrigued, 🤯 mind - blown
// Rating:
// ★★★★★
// Notes:
// Mostly listening and thinking about what goes into buying a business.The biggest shocker is that it is not recommended that I do this on the side.It should be my full time 40hrs per week day job.Also this will take anywhere from a few months to 2 years if done diligently.So far the biggest cost seems to be the salary that I give up if I decide to do it full time.