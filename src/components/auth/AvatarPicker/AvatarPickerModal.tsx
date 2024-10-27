import React from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import tw from 'twrnc';

const Camera = () => <AntDesign name="camera" size={24} color="rgb(59 130 246)" />

const ImagePlus = () => <MaterialCommunityIcons name="image-plus" size={24} color="rgb(59 130 246)" />

const Trash = () => <MaterialCommunityIcons name="trash-can-outline" size={24} color="rgb(239 68 68)" />

interface AvatarPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (result: ImagePicker.ImagePickerAsset) => void;
  onRemoveImage?: () => void;
  hasExistingImage?: boolean;
}

export default function AvatarPickerModal({
  visible,
  onClose,
  onImageSelected,
  onRemoveImage,
  hasExistingImage
}: AvatarPickerModalProps) {
  const requestPermission = async (
    permissionType: 'camera' | 'mediaLibrary'
  ) => {
    if (permissionType === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    } else {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      return status === 'granted';
    }
  };

  const handleCameraSelect = async () => {
    const hasPermission = await requestPermission('camera');
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Please enable camera access in your device settings to take a photo.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      onImageSelected(result.assets[0]);
      onClose();
    }
  };

  const handleGallerySelect = async () => {
    const hasPermission = await requestPermission('mediaLibrary');
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Please enable photo library access in your device settings to select a photo.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      onImageSelected(result.assets[0]);
      onClose();
    }
  };

  const renderOption = (
    icon: React.ReactNode,
    label: string,
    onPress: () => void
  ) => (
    <TouchableOpacity
      style={tw`flex-row items-center px-4 py-3 space-x-3`}
      onPress={onPress}
    >
      {icon}
      <Text style={tw`text-base`}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={tw`flex-1 bg-black/50`}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={tw`mt-auto bg-white rounded-t-3xl`}>
          <View style={tw`w-12 h-1 bg-gray-300 rounded-full mx-auto my-3`} />
          
          <Text style={tw`text-xl font-semibold px-4 mb-2`}>
            Profile Photo
          </Text>
          
          {renderOption(
            <Camera />,
            'Take Photo',
            handleCameraSelect
          )}
          
          {renderOption(
            <ImagePlus />,
            'Choose from Library',
            handleGallerySelect
          )}

          {hasExistingImage && onRemoveImage && (
            <>
              <View style={tw`h-px bg-gray-200 mx-4`} />
              {renderOption(
                <Trash />,
                'Remove Current Photo',
                onRemoveImage
              )}
            </>
          )}

          <TouchableOpacity
            style={tw`border-t border-gray-200 py-3 mt-2`}
            onPress={onClose}
          >
            <Text style={tw`text-blue-500 font-semibold text-center`}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
