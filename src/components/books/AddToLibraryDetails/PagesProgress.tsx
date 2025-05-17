import { View, Text, TextInput } from 'react-native';
import { Controller } from 'react-hook-form';
import tw from 'twrnc';
import React from 'react'


type PagesProgressProps = {
    control: any;
    errors: any;
    setValue: any;
}

const PagesProgress: React.FC<PagesProgressProps> = ({
    control,
    errors,
}) => {
    return (
        <View>
            <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Current Progress</Text>
            <View style={tw`flex-row items-center`}>
                <Controller
                    control={control}
                    name="currentPage"
                    render={({ field: { value, onChange } }) => (
                        <TextInput
                            style={tw`border border-gray-300 rounded-lg p-2 w-20 text-center`}
                            value={value?.toString()}
                            onChangeText={onChange}
                            keyboardType="numeric"
                        />
                    )}
                />
                <Text style={tw`mx-2 text-sm text-gray-600`}>of</Text>

                <Controller
                    control={control}
                    name="totalPage"
                    render={({ field: { value, onChange } }) => (
                        <TextInput
                            style={tw`border border-gray-300 rounded-lg p-2 w-20 text-center`}
                            value={value?.toString()}
                            onChangeText={onChange}
                            keyboardType="numeric"
                        />
                    )}
                />

                <Text style={tw`text-sm font-medium`}> pages</Text>
            </View>
            {errors.currentPage && <Text style={tw`text-red-500 text-xs mt-1`}>{errors.currentPage.message}</Text>}
            {errors.totalPage && <Text style={tw`text-red-500 text-xs mt-1`}>{errors.totalPage.message}</Text>}
        </View>
    )
}

export default PagesProgress