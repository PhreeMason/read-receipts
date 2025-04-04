import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, Platform, useWindowDimensions } from 'react-native';
import tw from 'twrnc';
import BookHeader from './BookHeader';
import BookDescription from './BookDescription';
import StatusSelector from './StatusSelector';
import ReadingProgress from './ReadingProgress';
import FormatSelector from './FormatSelector';
import AudioDuration from './AudioDuration';
import NotesInput from './NotesInput';
import AddToLibraryButton from './AddToLibraryButton';

const AddToLibraryDetails = ({ book = {}, onClose = () => { }, onAddToLibrary = () => { } }) => {
  const [status, setStatus] = useState('tbr');
  const [formats, setFormats] = useState(['physical']);
  const [currentPage, setCurrentPage] = useState('0');
  const [startDate, setStartDate] = useState(new Date());
  const [targetDate, setTargetDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showTargetDatePicker, setShowTargetDatePicker] = useState(false);
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [note, setNote] = useState('');

  // Format date for display
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Handle date change
  const onDateChange = (event, selectedDate, dateType) => {
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
      duration: format === 'audio' ? { hours: parseInt(hours), minutes: parseInt(minutes) } : null,
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
              setStartDate={setStartDate}
              targetDate={targetDate}
              setTargetDate={setTargetDate}
              showStartDatePicker={showStartDatePicker}
              setShowStartDatePicker={setShowStartDatePicker}
              showTargetDatePicker={showTargetDatePicker}
              setShowTargetDatePicker={setShowTargetDatePicker}
              onDateChange={onDateChange}
              formatDate={formatDate}
            />
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
