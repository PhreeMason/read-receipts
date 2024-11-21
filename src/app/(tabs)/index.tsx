import React from 'react';
import { ScrollView, SafeAreaView } from 'react-native';
import tw from 'twrnc';
import HomeHeader from '@/components/home/Header';
import CurrentlyReading from '@/components/home/CurrentlyReading';
import RecentlyAdded from '@/components/home/RecentlyAdded';
import ReadingStats from '@/components/home/ReadingStats';

const HomeScreen = () => {
  return (
    <SafeAreaView style={tw`flex-1 bg-white pt-4`}>
      <ScrollView style={tw`flex-1`}>
        {/* Header */}
        <HomeHeader />

        {/* Reading Stats */}
        <ReadingStats />

        {/* Currently Reading Section */}
        <CurrentlyReading />

        {/* Recently Added Section */}
        <RecentlyAdded />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;