import { Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { Share2 } from 'lucide-react-native';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function TabLayout() {

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'search' : 'search-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="bookDetails"
                options={() => ({
                    headerShown: true,
                    title: 'Book Details',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={() => console.log('share pressed')} style={tw`p-2`}>
                            <Share2 size={24} color="#4B5563" />
                        </TouchableOpacity>
                    )
                })}
            />
        </Tabs>
    );
}
