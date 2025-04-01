import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AvatarCircle from '@/components/shared/AvatarCircle'
import tw from 'twrnc';

const SearchHeader = () => {
    return (
        <View style={tw`flex justify-between items-center flex-row`}>
            <Text style={tw`text-2xl font-bold text-black`}>Search</Text>
            <AvatarCircle />
        </View>
    )
}

export default SearchHeader

const styles = StyleSheet.create({})