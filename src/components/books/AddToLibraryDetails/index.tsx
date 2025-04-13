import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Platform } from 'react-native';
import tw from 'twrnc';
import BookHeader from './BookHeader';
import BookDescription from './BookDescription';
import StatusSelector from './StatusSelector';
import ReadingProgress from './ReadingProgress';
import FormatSelector from './FormatSelector';
import AudioDuration from './AudioDuration';
import NotesInput from './NotesInput';
import AddToLibraryButton from './AddToLibraryButton';
import AudioProgress from './AudioProgress';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Book } from '@/types/book';

type StatusEnum = "tbr" | "current" | "completed" | "dnf";

type UserBook = {
    status: StatusEnum;
    formats: string[];
    currentPage: number;
    startDate: Date | null;
    targetDate: Date | null;
    duration: { hours: number; minutes: number } | null;
    currentAudioProgress: { hours: number; minutes: number; } | null;
    currentPercentage: number | null;
    note: string;
}

type AddToLibraryDetailsProps = {
    book: Book;
    onAddToLibrary: (userbook: UserBook) => void;

}

const AddToLibraryDetails: React.FC<AddToLibraryDetailsProps> = ({ book, onAddToLibrary = (userBook: UserBook) => { } }) => {
    const [status, setStatus] = useState<StatusEnum>('tbr');
    const [formats, setFormats] = useState(['physical']);
    const [currentPage, setCurrentPage] = useState('0');
    const [startDate, setStartDate] = useState(new Date());
    const [targetDate, setTargetDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showTargetDatePicker, setShowTargetDatePicker] = useState(false);
    const [hours, setHours] = useState('0');
    const [minutes, setMinutes] = useState('0');
    const [currentHours, setCurrentHours] = useState('0');
    const [currentMinutes, setCurrentMinutes] = useState('0');
    const [currentPercentage, setCurrentPercentage] = useState('0');
    const [note, setNote] = useState('');

    // Format date for display
    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    // Handle date change
    const onDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined, dateType: string) => {
        if (Platform.OS === 'android') {
            setShowStartDatePicker(false);
            setShowTargetDatePicker(false);
        }

        if (selectedDate) {
            if (dateType === 'start') {
                setStartDate(selectedDate);
            } else {
                setTargetDate(selectedDate);
            }
        }
    };

    // Handle add to library
    const handleAddToLibrary = () => {
        const bookData = {
            ...book,
            status,
            formats,
            currentPage: status === 'current' ? parseInt(currentPage) : 0,
            startDate: status === 'current' ? startDate : null,
            targetDate: status === 'current' ? targetDate : null,
            duration: formats.includes('audio') ? { hours: parseInt(hours), minutes: parseInt(minutes) } : null,
            currentAudioProgress: formats.includes('audio') && status === 'current' ? { hours: parseInt(currentHours), minutes: parseInt(currentMinutes) } : null,
            currentPercentage: formats.includes('ebook') && status === 'current' ? parseInt(currentPercentage) : null,
            note
        };

        onAddToLibrary(bookData);
    };

    return (
        <ScrollView style={tw`flex-1 bg-white`}>
            <View style={tw`px-6 pb-6 mt-4`}>
                <BookHeader book={book} />

                <BookDescription book={book} />

                <View style={tw`gap-5`}>
                    <StatusSelector
                        status={status}
                        setStatus={setStatus}
                    />

                    {status === 'current' && (
                        <ReadingProgress
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={book.total_pages}
                            startDate={startDate}
                            targetDate={targetDate}
                            showStartDatePicker={showStartDatePicker}
                            setShowStartDatePicker={setShowStartDatePicker}
                            showTargetDatePicker={showTargetDatePicker}
                            setShowTargetDatePicker={setShowTargetDatePicker}
                            onDateChange={onDateChange}
                            formatDate={formatDate}
                        />
                    )}

                    {status === 'current' && formats.includes('audio') && (
                        <AudioProgress
                            currentHours={currentHours}
                            setCurrentHours={setCurrentHours}
                            currentMinutes={currentMinutes}
                            setCurrentMinutes={setCurrentMinutes}
                        />
                    )}

                    {status === 'current' && formats.includes('ebook') && (
                        <View style={tw`gap-4 mt-4`}>
                            <Text style={tw`block text-sm font-medium text-gray-700 mb-1`}>Current Ebook Progress (%)</Text>
                            <TextInput
                                style={tw`border border-gray-300 rounded-lg p-2`}
                                placeholder="0"
                                value={currentPercentage}
                                onChangeText={setCurrentPercentage}
                                keyboardType="numeric"
                            />
                        </View>
                    )}

                    <FormatSelector
                        formats={formats}
                        setFormats={setFormats}
                    />

                    {formats.includes('audio') && (
                        <AudioDuration
                            hours={hours}
                            setHours={setHours}
                            minutes={minutes}
                            setMinutes={setMinutes}
                        />
                    )}

                    <NotesInput note={note} setNote={setNote} />

                    <AddToLibraryButton onPress={handleAddToLibrary} />
                </View>
            </View>
        </ScrollView>
    );
};

export default AddToLibraryDetails;
