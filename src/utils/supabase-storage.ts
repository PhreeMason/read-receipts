import supabase from '@/lib/supabase';
import { ImagePickerAsset } from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const BUCKET_NAME = 'avatars';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const uploadAvatar = async (asset: ImagePickerAsset, userId: string) => {
  try {
    // Get file info and check size
    const fileInfo = await FileSystem.getInfoAsync(asset.uri);
    if (fileInfo.exists && fileInfo.size && fileInfo.size > MAX_FILE_SIZE) {
      throw new Error('Image size too large. Please choose a smaller image (max 10MB).');
    }

    // Read the image as base64
    const base64 = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert to array buffer
    const arrayBuffer = Buffer.from(base64, 'base64');

    // Generate file path
    const filePath = `${userId}/avatar.${asset.uri.split('.').pop()}`;

    // Delete old avatar if exists
    const { data: oldFiles } = await supabase
      .storage
      .from(BUCKET_NAME)
      .list(userId);

    if (oldFiles && oldFiles.length > 0) {
      await supabase
        .storage
        .from(BUCKET_NAME)
        .remove(oldFiles.map(file => `${userId}/${file.name}`));
    }

    // Upload new avatar
    const { error: uploadError } = await supabase
      .storage
      .from(BUCKET_NAME)
      .upload(filePath, arrayBuffer, {
        contentType: `image/${asset.uri.split('.').pop()}`,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    // Update user profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);

    if (updateError) throw updateError;

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
      .from(BUCKET_NAME)
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
        .from(BUCKET_NAME)
        .list(userId);

      if (listError) throw listError;

      if (!files || files.length === 0) {
        resolve(null);
        return;
      }

      const { data: { publicUrl } } = supabase
        .storage
        .from(BUCKET_NAME)
        .getPublicUrl(`${userId}/${files[0].name}`);

      resolve(publicUrl);
    } catch (error) {
      reject(error);
    }
  });
};