import supabase from '@/lib/supabase';
import { ImagePickerAsset } from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

const AVATAR_BUCKET_NAME = 'avatars';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const uploadAvatar = async (asset: ImagePickerAsset, userId: string) => {
    try {
        // Check if file exists
        if (!asset.uri) {
            throw new Error('No file selected');
        }

        // Get file info
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);

        // Check file size
        if (fileInfo.exists && fileInfo.size && fileInfo.size > MAX_FILE_SIZE) {
            throw new Error('File size too large. Must be less than 10MB');
        }

        // Generate unique filename using userId and timestamp
        const fileExt = asset.uri.split('.').pop();
        const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;

        // Read file content as base64
        const base64 = await FileSystem.readAsStringAsync(asset.uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(AVATAR_BUCKET_NAME)
            .upload(fileName, decode(base64), {
                contentType: asset.mimeType || 'image/jpeg',
                upsert: true
            });

        if (error) {
            throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(AVATAR_BUCKET_NAME)
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error;
    }
};

export const deleteAvatar = async (userId: string) => {
    try {
        // Delete avatar from storage
        const { error: deleteError } = await supabase
            .storage
            .from(AVATAR_BUCKET_NAME)
            .remove([`${userId}/avatar`]);

        if (deleteError) throw deleteError;

        // Update profile to remove avatar_url
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: null })
            .eq('id', userId);

        if (updateError) throw updateError;
    } catch (error) {
        console.error('Error deleting avatar:', error);
        throw error;
    }
};

export const getAvatarUrl = (userId: string): Promise<string | null> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data: files, error: listError } = await supabase
                .storage
                .from(AVATAR_BUCKET_NAME)
                .list(userId);

            if (listError) throw listError;

            if (!files || files.length === 0) {
                resolve(null);
                return;
            }

            const { data: { publicUrl } } = supabase
                .storage
                .from(AVATAR_BUCKET_NAME)
                .getPublicUrl(`${userId}/${files[0].name}`);

            resolve(publicUrl);
        } catch (error) {
            reject(error);
        }
    });
};

export const BOOK_BUCKET_NAME = 'books';

export async function getPublicUrl(filePath: string | null) {
    if (!filePath) return '';
    const { data } = await supabase.storage
        .from(BOOK_BUCKET_NAME)
        .getPublicUrl(filePath); // Remove the epubs/ prefix concatenation

    return data.publicUrl;
}

export async function getSignedEpubUrl(filePath: string | null) {
    if (!filePath) return '';
    const { data, error } = await supabase.storage
        .from(BOOK_BUCKET_NAME)
        .createSignedUrl(filePath, 3600); // Remove the epubs/ prefix concatenation

    if (error) throw error;
    return data.signedUrl;
}

export async function uploadEpub(file: File, fileName: string) {
    const { data, error } = await supabase.storage
        .from(BOOK_BUCKET_NAME)
        .upload(`epubs/${fileName}`, file, {
            cacheControl: '3600',
            contentType: 'application/epub+zip'
        });
    if (error) throw error;
    return data;
}