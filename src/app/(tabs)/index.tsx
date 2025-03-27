import React from 'react';
import { ScrollView, SafeAreaView } from 'react-native';
import tw from 'twrnc';
import HomeHeader from '@/components/home/Header';
import CurrentlyReading from '@/components/home/CurrentlyReading';
import RecentlyAdded from '@/components/home/RecentlyAdded';
import ReadingStats from '@/components/home/ReadingStats';
import { useSearchBooksList } from '@/hooks/useBooks';

const HomeScreen = () => {
    const { data, error } = useSearchBooksList('red rising');
    console.log('data', data);
    console.log('error', error);
    return (
        <SafeAreaView style={tw`flex-1 bg-white pt-4`}>
            <ScrollView style={tw`flex-1`}>
                {/* Header */}
                <HomeHeader />

                {/* Currently Reading Section */}
                <CurrentlyReading />
                
                {/* Reading Stats */}
                <ReadingStats />


                {/* Recently Added Section */}
                <RecentlyAdded />
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;

// https://ebookfoundation.org/openzim.html
// https://library.kiwix.org/content/gutenberg_en_all/Home.html
// https://www.goodreads.com/book/show/944073.The_Blade_Itself?ref=nav_sb_ss_1_14
// https://dev.to/paullaros/updating-timestamps-automatically-in-supabase-5f5o - adding timestamps to supabase
// https://reactnativeelements.com/docs/components/bottomsheet - bottom sheet