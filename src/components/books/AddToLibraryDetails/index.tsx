import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { View, Text, TextInput, ScrollView } from 'react-native';
import tw from 'twrnc';
import BookHeader from './BookHeader';
import BookDescription from './BookDescription';
import StatusSelector from './StatusSelector';
import ReadingProgress from './ReadingProgress';
import Formatelector from './FormatSelector';
import AudioDuration from './AudioDuration';
import NoteInput from './NoteInput';
import AddToLibraryButton from './AddToLibraryButton';
import AudioProgress from './AudioProgress';
import { StatusEnum, BookInsert, BookAndUserBookInsert } from '@/types/book';
import { useSyncAudioPercentage } from './hooks';

type AddToLibraryDetailsProps = {
    book: BookInsert;
    onAddToLibrary: (data: BookAndUserBookInsert) => void;
    saving: boolean;
    saved: boolean;
}

const formSchema = z.object({
    status: z.enum(['tbr', 'current', 'completed']),
    format: z.array(z.enum(['physical', 'ebook', 'audio'])).min(1),
    currentPage: z.coerce.number().int().min(0).optional(),
    totalPage: z.coerce.number().int().positive(),
    startDate: z.date().optional(),
    targetDate: z.date().optional(),
    hours: z.coerce.number().int().min(0),
    minutes: z.coerce.number().int().min(0).max(59),
    currentHours: z.coerce.number().int().min(0),
    currentMinutes: z.coerce.number().int().min(0).max(59),
    currentPercentage: z.coerce.number().int().min(0).max(100).optional(),
    note: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

const AddToLibraryDetails: React.FC<AddToLibraryDetailsProps> = ({ book, onAddToLibrary }) => {
    const { control, setValue, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: 'tbr',
            format: ['physical'],
            totalPage: book.total_pages || 1,
            currentPage: 0,
            hours: 0,
            minutes: 0,
            currentHours: 0,
            currentMinutes: 0,
            currentPercentage: 0
        }
    });
    useSyncAudioPercentage({ setValue, watch });
    const status = watch('status');
    const format = watch('format');
    // Format date for display
    const formatDate = (date: Date) => {
        return date?.toISOString().split('T')[0] || '';
    };

    const onSubmit = (data: FormData) => {
        onAddToLibrary({
            ...book,
            ...data,
            // @ts-ignore
            format: data.format,
            start_date: status === 'current' && data.startDate ? data.startDate.toISOString() : null,
            target_completion_date: status === 'current' && data.targetDate ? data.targetDate.toISOString() : null,

        });
    };
    return (
        <ScrollView style={tw`flex-1 bg-white`}>
            <View style={tw`px-6 pb-6 mt-4`}>
                <BookHeader book={book} />

                <BookDescription book={book} />

                <View style={tw`gap-5`}>
                    <Controller
                        control={control}
                        name="status"
                        render={({ field: { onChange, value } }: {
                            field: {
                                onChange: (value: StatusEnum) => void;
                                value: StatusEnum;
                            };
                        }) => (
                            <StatusSelector
                                status={value}
                                setStatus={onChange}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="format"
                        render={({ field: { onChange, value } }: {
                            field: {
                                onChange: (value: string[]) => void;
                                value: string[];
                            };
                        }) => (
                            <Formatelector
                                formats={value}
                                setFormats={onChange}
                            />
                        )}
                    />

                    {status === 'current' && (
                        <ReadingProgress
                            control={control}
                            errors={errors}
                            setValue={setValue}
                            formatDate={formatDate}
                        />

                    )}

                    {status === 'current' && format.includes('audio') && (
                        <AudioProgress
                            control={control}
                            errors={errors}
                        />

                    )}


                    {format.includes('audio') && (
                        <AudioDuration control={control} errors={errors} />

                    )}

                    {(status === 'current' && format.includes('ebook')) ? (
                        <Controller
                            control={control}
                            name="currentPercentage"
                            render={({ field: { onChange, value } }) => (
                                <View style={tw`gap-4 mt-4`}>
                                    <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Current Ebook Progress (%)</Text>
                                    <TextInput
                                        style={tw`border border-gray-300 rounded-lg p-2 w-50px`}
                                        placeholder="0"
                                        value={value?.toString()}
                                        onChangeText={onChange}
                                        keyboardType="numeric"
                                    />
                                    {errors.currentPercentage && (
                                        <Text style={tw`text-red-500 text-xs mt-1`}>{errors.currentPercentage.message}</Text>
                                    )}
                                </View>
                            )}
                        />
                    ) : null}

                    <Controller
                        control={control}
                        name="note"
                        render={({ field: { onChange, value } }) => (
                            <NoteInput note={value || ''} setNote={onChange} />
                        )}
                    />

                    <AddToLibraryButton onPress={handleSubmit(onSubmit)} />
                </View>
            </View>
        </ScrollView>
    );
};

export default AddToLibraryDetails;
