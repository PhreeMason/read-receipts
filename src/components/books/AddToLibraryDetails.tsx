import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import HTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

const AddToLibraryDetails = ({ book = {}, onClose = () => {}, onAddToLibrary = () => {} }) => {
  const { width } = useWindowDimensions();
  const [status, setStatus] = useState('tbr');
  const [format, setFormat] = useState('physical');
  const [currentPage, setCurrentPage] = useState('0');
  const [startDate, setStartDate] = useState(new Date());
  const [targetDate, setTargetDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showTargetDatePicker, setShowTargetDatePicker] = useState(false);
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [note, setNote] = useState('');
  const [expanded, setExpanded] = useState(false);

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
      format,
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
      {/* Header Section */}
      <View style={tw`px-6 pt-12 pb-4`}>
        <View style={tw`flex-row items-center mb-6`}>
          <TouchableOpacity 
            style={tw`mr-4 w-10 h-10 rounded-full flex items-center justify-center bg-gray-100`}
            onPress={onClose}
          >
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold text-black`}>Add to Library</Text>
        </View>
      </View>

      {/* Book Details Section */}
      <View style={tw`px-6 pb-6`}>
        <View style={tw`flex-row space-x-4 mb-6`}>
          <View style={tw`flex-shrink-0`}>
            <View style={tw`w-24 h-36 rounded-md overflow-hidden shadow-md`}>
              <Image 
                source={{ uri: book.cover_image_url }} 
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
            </View>
          </View>
          <View style={tw`flex-grow`}>
            <Text style={tw`font-bold text-lg text-black mb-1`}>{book.title}</Text>
            <Text style={tw`text-gray-600 text-sm mb-2`}>{book.metadata?.authors?.join(', ')}</Text>
            <View style={tw`flex-row items-center mb-1`}>
              <View style={tw`flex-row`}>
                {[...Array(Math.floor(book.rating))].map((_, i) => (
                  <Ionicons key={i} name="star" size={14} color="#8C6A5B" />
                ))}
                {book.rating % 1 > 0 && <Ionicons name="star-half" size={14} color="#8C6A5B" />}
                {[...Array(5 - Math.ceil(book.rating))].map((_, i) => (
                  <Ionicons key={i + Math.ceil(book.rating)} name="star-outline" size={14} color="#8C6A5B" />
                ))}
              </View>
              <Text style={tw`text-xs text-gray-500 ml-1`}>{book.rating} ({book.rating_count?.toLocaleString()} ratings)</Text>
            </View>
            <Text style={tw`text-xs text-gray-500 mb-1`}>
              {book.genres?.slice(0, 2).join(' • ')} • {book.total_pages} pages
            </Text>
            <Text style={tw`text-xs text-gray-500`}>
              Published {new Date(book.publication_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
          </View>
        </View>

        {/* Book Description */}
        <View style={tw`mb-6`}>
          {book.description && (
            <>
              <HTML 
                source={{ html: expanded ? book.description : book.description.substring(0, 150) + '...' }} 
                contentWidth={width - 48}
                tagsStyles={{
                  p: { fontSize: 14, color: '#374151', lineHeight: 20 },
                  i: { fontStyle: 'italic' },
                  br: { height: 12 }
                }}
              />
              <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <Text style={tw`text-sm font-medium text-gray-800 mt-1`}>
                  {expanded ? 'Read less' : 'Read more'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Add to Library Form */}
        <View style={tw`space-y-5`}>
          {/* Status Selection */}
          <View>
            <Text style={tw`block text-sm font-medium text-gray-700 mb-1`}>Status *</Text>
            <View style={tw`border border-gray-300 rounded-lg`}>
              <Picker
                selectedValue={status}
                onValueChange={(itemValue) => setStatus(itemValue)}
                style={tw`h-12`}
              >
                <Picker.Item label="To Be Read" value="tbr" />
                <Picker.Item label="Currently Reading" value="current" />
                <Picker.Item label="Completed" value="completed" />
                <Picker.Item label="Did Not Finish" value="dnf" />
              </Picker>
            </View>
          </View>

          {/* Currently Reading Options */}
          {status === 'current' && (
            <View style={tw`space-y-4 border-t border-gray-200 pt-4`}>
              <View>
                <Text style={tw`block text-sm font-medium text-gray-700 mb-1`}>Current Progress</Text>
                <View style={tw`flex-row items-center`}>
                  <TextInput
                    style={tw`border border-gray-300 rounded-lg p-2 w-20 text-center`}
                    value={currentPage}
                    onChangeText={setCurrentPage}
                    keyboardType="numeric"
                  />
                  <Text style={tw`mx-2 text-sm text-gray-600`}>of</Text>
                  <Text style={tw`text-sm font-medium`}>{book.total_pages} pages</Text>
                </View>
              </View>

              <View>
                <Text style={tw`block text-sm font-medium text-gray-700 mb-1`}>Start Date</Text>
                <TouchableOpacity 
                  style={tw`border border-gray-300 rounded-lg p-3`}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text>{formatDate(startDate)}</Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, date) => onDateChange(event, date, 'start')}
                  />
                )}
              </View>

              <View>
                <Text style={tw`block text-sm font-medium text-gray-700 mb-1`}>Target Completion Date</Text>
                <TouchableOpacity 
                  style={tw`border border-gray-300 rounded-lg p-3`}
                  onPress={() => setShowTargetDatePicker(true)}
                >
                  <Text>{formatDate(targetDate)}</Text>
                </TouchableOpacity>
                {showTargetDatePicker && (
                  <DateTimePicker
                    value={targetDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, date) => onDateChange(event, date, 'target')}
                  />
                )}
              </View>
            </View>
          )}

          {/* Format Selection */}
          <View>
            <Text style={tw`block text-sm font-medium text-gray-700 mb-1`}>Format *</Text>
            <View style={tw`grid grid-cols-3 gap-3 mt-1`}>
              <TouchableOpacity
                style={tw`${format === 'physical' ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-300'} border rounded-lg py-3 px-2`}
                onPress={() => setFormat('physical')}
              >
                <View style={tw`flex-col items-center`}>
                  <Ionicons name="book-outline" size={16} color="#8C6A5B" style={tw`mb-1`} />
                  <Text style={tw`text-sm font-medium text-center`}>Physical</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`${format === 'ebook' ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-300'} border rounded-lg py-3 px-2`}
                onPress={() => setFormat('ebook')}
              >
                <View style={tw`flex-col items-center`}>
                  <Ionicons name="tablet-portrait-outline" size={16} color="#8C6A5B" style={tw`mb-1`} />
                  <Text style={tw`text-sm font-medium text-center`}>E-Book</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`${format === 'audio' ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-300'} border rounded-lg py-3 px-2`}
                onPress={() => setFormat('audio')}
              >
                <View style={tw`flex-col items-center`}>
                  <Ionicons name="headset-outline" size={16} color="#8C6A5B" style={tw`mb-1`} />
                  <Text style={tw`text-sm font-medium text-center`}>Audio</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Audio Duration Field */}
          {format === 'audio' && (
            <View style={tw`space-y-2 mt-4`}>
              <Text style={tw`block text-sm font-medium text-gray-700 mb-1`}>Audiobook Duration</Text>
              <View style={tw`grid grid-cols-2 gap-4`}>
                <View>
                  <Text style={tw`block text-xs text-gray-500 mb-1`}>Hours</Text>
                  <TextInput
                    style={tw`border border-gray-300 rounded-lg p-2`}
                    placeholder="0"
                    value={hours}
                    onChangeText={setHours}
                    keyboardType="numeric"
                  />
                </View>
                <View>
                  <Text style={tw`block text-xs text-gray-500 mb-1`}>Minutes</Text>
                  <TextInput
                    style={tw`border border-gray-300 rounded-lg p-2`}
                    placeholder="0"
                    value={minutes}
                    onChangeText={setMinutes}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          )}

          {/* Notes Field */}
          <View>
            <Text style={tw`block text-sm font-medium text-gray-700 mb-1`}>Notes</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3 h-24`}
              placeholder="Add your notes about this book..."
              multiline
              value={note}
              onChangeText={setNote}
            />
          </View>

          {/* Add to Library Button */}
          <TouchableOpacity
            style={tw`bg-gray-800 rounded-lg py-3 px-4 mt-6`}
            onPress={handleAddToLibrary}
          >
            <Text style={tw`text-white text-center font-medium`}>Add to Library</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddToLibraryDetails;
