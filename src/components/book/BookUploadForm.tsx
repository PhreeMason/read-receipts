// components/book/BookUploadForm.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useAddBook } from '@/hooks/useBooks';
import tw from 'twrnc';

function BookUploadForm() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [coverURl, setCoverUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);
    const addBookMutation = useAddBook();

    const handleFilePick = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/epub+zip',
                copyToCacheDirectory: true,
            });

            console.log(JSON.stringify(result, null, 2));
            if (result.assets && result.assets[0]) {
                setSelectedFile(result);
            }
        } catch (err) {
            console.error('Error picking file:', err);
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile?.assets?.[0]) {
            alert('Please select an EPUB file');
            return;
        }

        let file = Platform.OS === 'web' ? selectedFile.assets[0].file : selectedFile.assets[0];
        console.log({ file })
        try {
            await addBookMutation.mutateAsync({
                bookData: {
                    title,
                    author,
                    description,
                    cover_url: coverURl
                },
                epubFile: file as any, // You might need to adjust the file type based on your Book type
            }, {
                onSuccess: () => {
                    // Reset form
                    setTitle('');
                    setAuthor('');
                    setDescription('');
                    setCoverUrl('');
                    setSelectedFile(null);
                    alert('Book uploaded successfully!');
                }
            });
        } catch (error) {
            console.error('Error uploading book:', error);
            alert('Failed to upload book');
        }
    };

    return (
        <View style={tw`p-4`}>
            <Text style={tw`text-2xl font-bold mb-4`}>Upload New Book</Text>

            <View style={tw`mb-4`}>
                <Text style={tw`text-gray-600 mb-1`}>Title</Text>
                <TextInput
                    style={tw`border border-gray-300 rounded-lg p-2`}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Enter book title"
                />
            </View>

            <View style={tw`mb-4`}>
                <Text style={tw`text-gray-600 mb-1`}>Author</Text>
                <TextInput
                    style={tw`border border-gray-300 rounded-lg p-2`}
                    value={author}
                    onChangeText={setAuthor}
                    placeholder="Enter author name"
                />
            </View>

            <View style={tw`mb-4`}>
                <Text style={tw`text-gray-600 mb-1`}>Cover Url</Text>
                <TextInput
                    style={tw`border border-gray-300 rounded-lg p-2`}
                    value={coverURl}
                    onChangeText={setCoverUrl}
                    placeholder="Enter Cover Url"
                />
            </View>

            <View style={tw`mb-4`}>
                <Text style={tw`text-gray-600 mb-1`}>Description</Text>
                <TextInput
                    style={tw`border border-gray-300 rounded-lg p-2 h-24`}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter book description"
                    multiline
                    numberOfLines={4}
                />
            </View>

            <View style={tw`mb-4`}>
                <TouchableOpacity
                    onPress={handleFilePick}
                    style={tw`border border-gray-300 rounded-lg p-4 items-center bg-gray-50`}
                >
                    <Text style={tw`text-gray-600`}>
                        {selectedFile?.assets?.[0]?.name || 'Select EPUB file'}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={handleSubmit}
                disabled={addBookMutation.isPending}
                style={tw`bg-blue-500 rounded-lg p-4 items-center ${addBookMutation.isPending ? 'opacity-50' : ''}`}
            >
                <Text style={tw`text-white font-bold`}>
                    {addBookMutation.isPending ? 'Uploading...' : 'Upload Book'}
                </Text>
            </TouchableOpacity>

            {addBookMutation.isError && (
                <Text style={tw`mt-2 text-red-500`}>
                    Error: {addBookMutation.error.message}
                </Text>
            )}
        </View>
    );
}

export default BookUploadForm;