import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import tw from 'twrnc';
import Entypo from '@expo/vector-icons/Entypo';
import BookMeta from '@/components/book/details/BookMeta';
import StatusMenu  from '@/components/book/details/StatusMenu';
import type { ReadingStatus, StatusOption } from '@/types/book';
import { statusOptions } from '@/utils/constants';
import QuickStats from '@/components/book/details/QuickStats';
import Tags from '@/components/book/details/Tags';
import ReadingBuddies from '@/components/book/details/ReadingBuddies';
import ActionButtons from '@/components/book/details/ActionButtons';

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
        description: "Dungeon Crawler Carl Book 1 is now on Amazon!&#160;mybook.to/dungeoncrawlercarl\nRoyal Road and Patreon is where to get the newest chapters and releases.&#160;\nThe apocalypsewillbe televised!\nA man. His ex-girlfriend's cat. A sadistic game show unlike anything in the universe: a dungeon crawl where survival depends on killing your prey in the most entertaining way possible.In a flash, every human-erected construction on Earth—from Buckingham Palace to the tiniest of sheds—collapses in a heap, sinking into the ground.The buildings and all the people inside have all been atomized and transformed into the dungeon: an 18-level labyrinth filled with traps, monsters, and loot. A dungeon so enormous, it circles the entire globe.Only a few dare venture inside. But once you're in, you can't get out. And what's worse, each level has a time limit. You have but days to find a staircase to the next level down, or it's game over. In this game, it's not about your strength or your dexterity. It's about your followers, your views. Your clout. It's about building an audience and killing those goblins with style.You can't just survive here. You gotta survive big.You gotta fight with vigor, with excitement. You gotta make them stand up and cheer. And if you do have that \"it\" factor, you may just find yourself with a following. That's the only way to truly survive in this game—with the help of the loot boxes dropped upon you by the generous benefactors watching from across the galaxy.They call it&#160;Dungeon Crawler World. But for Carl, it's anything but a game.\nDCC Discord!&#160;\n10/01/20\nThe first several chapters of DCC are now off of Royal Road because the book is on Amazon. I want to thank all of you for 9 months of amazing support. This is and Patreon will always be the place for the newest chapters and content, but to comply with Amazon's Kindle Unlimited policy, I can't have more than 10% of the story up here.&#160;\n\n\nThis is a work in progress. Major editing will be done after the book is complete, so there will be egregious typos and parts that make no sense whatsoever. Please, please feel free to point any and all of these things out. Chapters WILL get edited, and that editing might break earlier chapters. I will attempt to keep readers apprised of all changes. Updates one-two days a week.",
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
        <SafeAreaView style={tw`flex-1 bg-gray-50 pt-4`}>
            <ScrollView style={tw`flex-1`}>
                <View style={tw`p-4 gap-1`}>
                    <BookMeta
                        bookData={bookData}
                        currentStatus={currentStatus}
                    />
                    <View>
                        {/* <Text style={tw`text-lg font-semibold mb-2`}>About</Text> */}
                        <Text style={tw`text-gray-700 leading-relaxed`} >
                            {bookData.description}
                        </Text>
                    </View>
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
                            <Entypo name="chevron-down" size={16} color="black" style={[
                                    tw`transition-transform`,
                                    isStatusMenuOpen && { transform: [{ rotate: '180deg' }] }
                                ]} />
                        </TouchableOpacity>
                    )}
                    <ActionButtons handleAddToLibrary={handleAddToLibrary} isAddingToLibrary={isAddingToLibrary} currentStatus={currentStatus} />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default BookDetailsScreen;