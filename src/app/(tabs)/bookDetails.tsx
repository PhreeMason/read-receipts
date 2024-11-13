import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import tw from 'twrnc';
import {
    Book,
    BookOpen,
    Users,
    ChevronDown,
    Check,
    Clock,
    Heart,
    Timer,
} from 'lucide-react-native';
import BookCover from '@/components/book-details/BookCover';
import StatusMenu  from '@/components/book-details/StatusMenu';
import type { ReadingStatus, StatusOption } from '@/types/book';
import { statusOptions } from '@/utils/constants';
import QuickStats from '@/components/book-details/QuickStats';
import Tags from '@/components/book-details/Tags';
import ReadingBuddies from '@/components/book-details/ReadingBuddies';
import ActionButtons from '@/components/book-details/ActionButtons';

// Main Screen Component
const BookDetailsScreen = () => {
    const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<ReadingStatus | null>(null);
    const [isAddingToLibrary, setIsAddingToLibrary] = useState(false);

    const bookData = {
        title: "The Midnight Library",
        author: "Matt Haig",
        coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg",
        rating: 4.2,
        totalRatings: 2847,
        estimatedReadingTime: "6.2 hours",
        activeReaders: 342,
        totalAnnotations: 1289,
        description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
        genres: ["Literary Fiction", "Contemporary", "Fantasy"],
        moods: ["Reflective", "Hopeful", "Philosophical"],
        currentPage: 112,
        pageCount: 304,
        progressPercent: 37,
        readingStreak: 5,
        estimatedTime: "6.2 hours",
        timeLeft: "4.2 hours left",
        enjoyedBy: "4.8/5",
        completionRate: "78%",
        readingPace: "12% faster than average",
        nextMilestone: "You're almost halfway there!",
        readingBuddies: [
            { name: "Emma W.", progress: 52 },
            { name: "James L.", progress: 48 }
        ],
        recentActivity: [
            { user: "Sarah K.", text: "Every book gives a chance to try another life you could have lived." },
            { user: "Michael R.", text: "This passage reminds me of Jorge Luis Borges..." }
        ]
    };

    const getCurrentStatusDetails = (status: string | null): StatusOption => {
        const stutusToFind = status || currentStatus;
        return statusOptions.find(option => option.id === stutusToFind) || statusOptions[0];
    };

    const getActionButton = () => {
        if (!currentStatus) {
            return {
                label: "Add to Library",
                icon: BookOpen,
                action: handleAddToLibrary,
                loading: isAddingToLibrary
            };
        }

        const status = getCurrentStatusDetails(currentStatus);

        return {
            label: status?.actionLabel || "Start Reading",
            icon: status?.id === "finished" ? Book : BookOpen,
            action: () => console.log(`Navigate to reader - ${status?.id}`),
            loading: false
        };
    };

    // Status change handlers
    const handleStatusChange = (
        statusId: ReadingStatus,
    ) => {
        setCurrentStatus(statusId);
        setIsStatusMenuOpen(false);
    };

    const handleAddToLibrary = () => {
        setIsAddingToLibrary(true);
        // Simulate API call
        setTimeout(() => {
            setCurrentStatus("want-to-read");
            setIsAddingToLibrary(false);
        }, 500);
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <ScrollView style={tw`flex-1`}>
                <View style={tw`p-4 gap-6`}>
                    <BookCover
                        bookData={bookData}
                        currentStatus={currentStatus}
                        getCurrentStatusDetails={getCurrentStatusDetails}
                    />
                    <QuickStats bookData={bookData} />
                    <Tags
                        title="Genres"
                        items={bookData.genres}
                        bgColor="bg-blue-100"
                        textColor="text-blue-700"
                    />
                    <Tags
                        title="Moods"
                        items={bookData.moods}
                        bgColor="bg-purple-100"
                        textColor="text-purple-700"
                    />
                    <ReadingBuddies buddies={bookData.readingBuddies} />
                    <View>
                        <Text style={tw`text-lg font-semibold mb-2`}>About</Text>
                        <Text style={tw`text-gray-700 leading-relaxed`}>
                            {bookData.description}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View style={tw`bg-white border-t border-gray-200 p-4 gap-3`}>
                <StatusMenu
                    isOpen={isStatusMenuOpen}
                    statusOptions={statusOptions}
                    currentStatus={currentStatus}
                    onStatusChange={handleStatusChange}
                />
                <View style={tw`flex-row gap-3`}>
                    {currentStatus && (
                        <TouchableOpacity
                            onPress={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                            style={tw`flex-1 py-3 px-4 rounded-lg border border-gray-200 flex-row items-center justify-center bg-white`}
                        >
                            <Text style={tw`text-gray-700 mr-2`}>Change Status</Text>
                            <ChevronDown
                                size={16}
                                style={[
                                    tw`transition-transform`,
                                    isStatusMenuOpen && { transform: [{ rotate: '180deg' }] }
                                ]}
                            />
                        </TouchableOpacity>
                    )}
                    <ActionButtons getActionButton={getActionButton} />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default BookDetailsScreen;