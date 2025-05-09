import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import tw from 'twrnc';

const RecentlyAdded = () => {

    return (
        <View style={tw`mt-8 pb-8`}>
            <View style={tw`px-4 flex-row justify-between items-center`}>
                <Text style={tw`text-lg font-semibold text-gray-900`}>Recently Added</Text>
                <TouchableOpacity>
                    <Text style={tw`text-blue-600`}>See All</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={tw`mt-4 pl-4`}
            >
                    <Text>hi</Text>
            </ScrollView>
        </View>
    )
}

export default RecentlyAdded