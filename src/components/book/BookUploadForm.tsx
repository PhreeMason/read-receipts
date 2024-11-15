import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useAddBook } from '@/hooks/useBooks';
import tw from 'twrnc';

const GENRES = [
    'Literary Fiction', 'Contemporary', 'Fantasy', 'Science Fiction',
    'Mystery', 'Non-Fiction', 'Biography', 'Self-Help', 'Romance', 'Historical Fiction'
];

const MOODS = [
    'Reflective', 'Hopeful', 'Philosophical', 'Dark',
    'Funny', 'Suspenseful', 'Romantic', 'Inspiring', 'Informative', 'Adventurous'
];

export default function BookUploadForm() {
    const [formData, setFormData] = useState<{
        title: string,
        author: string,
        description: string,
        coverUrl: string,
        estimatedTime: string,
        rating: string,
        selectedGenres: string[],
        selectedMoods: string[],
        selectedFile: DocumentPicker.DocumentPickerResult | null
    }>({
        title: '',
        author: '',
        description: '',
        coverUrl: '',
        estimatedTime: '',
        rating: '',
        selectedGenres: [],
        selectedMoods: [],
        selectedFile: null
    });

    const addBookMutation = useAddBook();

    const handleFilePick = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/epub+zip',
                copyToCacheDirectory: true,
            });

            console.log(JSON.stringify(result, null, 2));
            if (result.assets && result.assets[0]) {
                setFormData(prev => ({ ...prev, selectedFile: result }));
            }
        } catch (err) {
            console.error('Error picking file:', err);
        }
    };

    const toggleSelection = (item: string, type: string) => {
        const field = type === 'genre' ? 'selectedGenres' : 'selectedMoods';
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(item)
                ? prev[field].filter(i => i !== item)
                : [...prev[field], item]
        }));
    };

    const handleSubmit = async () => {
        if (!formData.selectedFile?.assets?.[0]) {
            alert('Please select an EPUB file');
            return;
        }

        let file = Platform.OS === 'web' ? formData.selectedFile.assets[0].file : formData.selectedFile.assets[0];
        console.log({ file })
        try {
            await addBookMutation.mutateAsync({
                bookData: {
                    title: formData.title,
                    author: formData.author,
                    description: formData.description,
                    cover_url: formData.coverUrl,
                    rating: parseFloat(formData.rating) || 0,
                    genres: formData.selectedGenres,
                    moods: formData.selectedMoods,
                    rating_count: 0,
                    currently_reading_count: 0,
                    total_readers: 0,
                    comment_count: 0
                },
                // @ts-ignore
                epubFile: file,
            });

            // Reset form
            setFormData({
                title: '',
                author: '',
                description: '',
                coverUrl: '',
                estimatedTime: '',
                rating: '',
                selectedGenres: [],
                selectedMoods: [],
                selectedFile: null
            });

            alert('Book uploaded successfully!');
        } catch (error) {
            console.error('Error uploading book:', error);
            alert('Failed to upload book');
        }
    };

    return (
        <ScrollView style={tw`p-4 mt-4`}>
            <Text style={tw`text-2xl font-bold mb-4`}>Upload New Book</Text>

            {/* Basic Info Section */}
            <View style={tw`gap-4 mb-6`}>
                <View>
                    <Text style={tw`text-gray-600 mb-1`}>Title *</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg p-2`}
                        value={formData.title}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                        placeholder="Enter book title"
                    />
                </View>

                <View>
                    <Text style={tw`text-gray-600 mb-1`}>Author *</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg p-2`}
                        value={formData.author}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, author: text }))}
                        placeholder="Enter author name"
                    />
                </View>

                <View>
                    <Text style={tw`text-gray-600 mb-1`}>Description *</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg p-2`}
                        value={formData.description}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                        placeholder="Enter description"
                    />
                </View>

                <View>
                    <Text style={tw`text-gray-600 mb-1`}>Cover url *</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg p-2`}
                        value={formData.coverUrl}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, coverUrl: text }))}
                        placeholder="Enter Cover url"
                    />
                </View>

                <View>
                    <Text style={tw`text-gray-600 mb-1`}>Estimated Reading Time (hours)</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg p-2`}
                        value={formData.estimatedTime}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, estimatedTime: text }))}
                        placeholder="Enter estimated reading time"
                        keyboardType="numeric"
                    />
                </View>

                <View>
                    <Text style={tw`text-gray-600 mb-1`}>Initial Rating (0-5)</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg p-2`}
                        value={formData.rating}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, rating: text }))}
                        placeholder="Enter initial rating"
                        keyboardType="decimal-pad"
                    />
                </View>
            </View>

            {/* Genres Section */}
            <View style={tw`mb-6`}>
                <Text style={tw`text-lg font-semibold mb-2`}>Genres</Text>
                <View style={tw`flex-row flex-wrap gap-2`}>
                    {GENRES.map((genre) => (
                        <TouchableOpacity
                            key={genre}
                            style={tw`px-3 py-1 rounded-full ${formData.selectedGenres.includes(genre)
                                ? 'bg-blue-500'
                                : 'bg-gray-200'
                                }`}
                            onPress={() => toggleSelection(genre, 'genre')}
                        >
                            <Text style={tw`${formData.selectedGenres.includes(genre)
                                ? 'text-white'
                                : 'text-gray-800'
                                }`}>
                                {genre}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Moods Section */}
            <View style={tw`mb-6`}>
                <Text style={tw`text-lg font-semibold mb-2`}>Moods</Text>
                <View style={tw`flex-row flex-wrap gap-2`}>
                    {MOODS.map((mood) => (
                        <TouchableOpacity
                            key={mood}
                            style={tw`px-3 py-1 rounded-full ${formData.selectedMoods.includes(mood)
                                ? 'bg-purple-500'
                                : 'bg-gray-200'
                                }`}
                            onPress={() => toggleSelection(mood, 'mood')}
                        >
                            <Text style={tw`${formData.selectedMoods.includes(mood)
                                ? 'text-white'
                                : 'text-gray-800'
                                }`}>
                                {mood}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* File Upload Section */}
            <View style={tw`mb-6`}>
                <TouchableOpacity
                    onPress={handleFilePick}
                    style={tw`border-2 border-dashed border-gray-300 rounded-lg p-4 items-center bg-gray-50`}
                >
                    <Text style={tw`text-gray-600`}>
                        {formData.selectedFile?.assets?.[0]?.name || 'Select EPUB file *'}
                    </Text>
                </TouchableOpacity>

            </View>

            {/* Submit Button */}
            <TouchableOpacity
                onPress={handleSubmit}
                disabled={addBookMutation.isPending}
                style={tw`bg-blue-500 rounded-lg p-4 items-center ${addBookMutation.isPending ? 'opacity-50' : ''
                    }`}
            >
                <Text style={tw`text-white font-bold`}>
                    {addBookMutation.isPending ? 'Uploading...' : 'Upload Book'}
                </Text>
            </TouchableOpacity>

            {addBookMutation.isError ? (
                <Text style={tw`mt-2 text-red-500`}>
                    Error: {addBookMutation.error.message}
                </Text>
            ) : null}
        </ScrollView>
    );
}