import React, { useState } from 'react';
import {
    View,
    ScrollView,
    Text,
    TextInput,
    Alert,
    Platform,
} from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import AvatarPicker from '@/components/auth/AvatarPicker';
import Button from '@/components/shared/Button';
import tw from 'twrnc';

export default function ProfileScreen() {
    const { signOut, profile, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState(profile?.username || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleEdit = () => {
        setUsername(profile?.username || '');
        setIsEditing(true);
    };

    const handleCancel = () => {
        setUsername(profile?.username || '');
        setIsEditing(false);
    };

    const validateUsername = (username: string) => {
        if (username.length < 3) {
            return 'Username must be at least 3 characters long';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return 'Username can only contain letters, numbers, and underscores';
        }
        return null;
    };

    const handleSave = async () => {
        const error = validateUsername(username);
        if (error) {
            Alert.alert('Invalid Username', error);
            return;
        }

        setIsSaving(true);
        try {
            const resp = await updateProfile({
                username,
            });

            if (resp && resp.error) throw resp.error;
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            console.log(error);
            // Alert.alert('Error', (error as Error).message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarUpdate = async (url: string) => {
        try {
            const resp = await updateProfile({
                avatar_url: url,
            });

            if (resp && resp.error) throw resp.error;
            Alert.alert('Success', 'Profile picture updated successfully');
        } catch (error) {
            Alert.alert('Error', (error as Error).message);
        }
    };

    const handleSignOut = async () => {
        if (Platform.OS === 'web') {
            await signOut();
            return;
        }
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: signOut,
                },
            ]
        );
    };

    return (
        <ScrollView style={tw`flex-1 bg-white`}>
            <View style={tw`p-6 gap-8`}>
                {/* Profile Header */}
                <View style={tw`items-center gap-4`}>
                    <AvatarPicker
                        defaultUrl={profile?.avatar_url || null}
                        onSuccess={handleAvatarUpdate}
                        size={120}
                    />

                    {isEditing ? (
                        <View style={tw`w-full gap-4`}>
                            <View style={tw`gap-2`}>
                                <Text style={tw`text-sm font-medium text-gray-700`}>
                                    Username
                                </Text>
                                <TextInput
                                    style={tw`p-4 border border-gray-300 rounded-lg bg-white`}
                                    value={username}
                                    onChangeText={setUsername}
                                    placeholder="Enter username"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    maxLength={30}
                                />
                                <Text style={tw`text-xs text-gray-500`}>
                                    Letters, numbers, and underscores only
                                </Text>
                            </View>

                            <View style={tw`flex-row gap-4 pt-4`}>
                                <Button
                                    variant="outline"
                                    onPress={handleCancel}
                                    className='flex-1 mr-4'
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onPress={handleSave}
                                    isLoading={isSaving}
                                    className='flex-1'
                                >
                                    Save
                                </Button>
                            </View>
                        </View>
                    ) : (
                        <View style={tw`items-center gap-2`}>
                            <Text style={tw`text-2xl font-bold`}>
                                {profile?.username}
                            </Text>
                            <Button
                                variant="outline"
                                onPress={handleEdit}
                            >
                                Edit Profile
                            </Button>
                        </View>
                    )}
                </View>

                {/* Sign Out Button */}
                <View style={tw`pt-4`}>
                    <Button
                        variant="outline"
                        onPress={handleSignOut}
                        className="border-red-500"
                        textClassName="text-red-500"
                    >
                        Sign Out
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
}