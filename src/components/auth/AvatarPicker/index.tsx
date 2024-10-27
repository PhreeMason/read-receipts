import React, { useState, useEffect  } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { ImagePickerAsset } from 'expo-image-picker';
import AntDesign from '@expo/vector-icons/AntDesign';

import { useAuth } from '@/hooks/useAuth';
import { uploadImageToSupabase } from '@/utils/image';
import { uploadAvatar, deleteAvatar } from '@/utils/supabase-storage';

import AvatarImage from './AvatarImage';
import AvatarPickerModal from './AvatarPickerModal';

const Camera = () => <AntDesign name="camera" size={16} color="white" />

interface AvatarPickerProps {
    defaultUrl?: string | null;
    onSuccess?: (url: string) => void;
    onError?: (error: Error) => void;
    size?: number;
    showEditButton?: boolean;
    disabled?: boolean;
}  

export default function AvatarPicker({
    defaultUrl,
    onSuccess,
    onError,
    size = 100,
    showEditButton = true,
    disabled = false,
  }: AvatarPickerProps) {
    const { profile: user } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(defaultUrl || null);
  
    useEffect(() => {
      if (defaultUrl) {
        setAvatarUrl(defaultUrl);
      }
    }, [defaultUrl]);
  
    const handleImageSelected = async (asset: ImagePickerAsset) => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const url = await uploadAvatar(asset, user.id);
        setAvatarUrl(url);
        onSuccess?.(url);
      } catch (error) {
        onError?.(error as Error);
      } finally {
        setIsLoading(false);
        setModalVisible(false);
      }
    };
  
    const handleRemoveImage = async () => {
      if (!user) return;
  
      setIsLoading(true);
      try {
        await deleteAvatar(user.id);
        setAvatarUrl(null);
      } catch (error) {
        onError?.(error as Error);
      } finally {
        setIsLoading(false);
        setModalVisible(false);
      }
    };
  
    return (
      <View className="items-center">
        <TouchableOpacity
          onPress={() => !disabled && !isLoading && setModalVisible(true)}
          disabled={disabled || isLoading}
          className="relative"
          activeOpacity={0.7}
        >
          <AvatarImage uri={avatarUrl} size={size} />
          
          {isLoading && (
            <View className="absolute inset-0 bg-black/20 rounded-full 
              items-center justify-center">
              <ActivityIndicator color="#ffffff" />
            </View>
          )}
          
          {showEditButton && !disabled && !isLoading && (
            <View className="absolute bottom-0 right-0 bg-blue-500 
              rounded-full p-2 shadow-sm border-2 border-white">
              <Camera />
            </View>
          )}
        </TouchableOpacity>
  
        <AvatarPickerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onImageSelected={handleImageSelected}
          onRemoveImage={avatarUrl ? handleRemoveImage : undefined}
          hasExistingImage={!!avatarUrl}
        />
      </View>
    );
  }
