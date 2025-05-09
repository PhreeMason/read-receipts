// utils/image.ts
import * as FileSystem from 'expo-file-system';
import { ImagePickerAsset } from 'expo-image-picker';
import supabase from '@/lib/supabase'; // Your Supabase client

export const uploadImageToSupabase = async (
  asset: ImagePickerAsset,
  bucket: string = 'avatars',
  path?: string
): Promise<string> => {
  try {
    // Convert to base64
    const base64 = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Generate unique filename
    const filename = `${path || 'avatar'}-${Date.now()}.${asset.uri.split('.').pop()}`;

    // Upload to Supabase
    const { error } = await supabase
      .storage
      .from(bucket)
      .upload(filename, atob(base64), {
        contentType: asset.mimeType || 'image/jpeg',
        upsert: true
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(filename);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};
