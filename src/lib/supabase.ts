import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as aesjs from 'aes-js';
import 'react-native-get-random-values';
import { Platform } from 'react-native';
// code came from here https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native?queryGroups=auth-store&auth-store=secure-store
class LargeSecureStore {
    private async _encrypt(key: string, value: string) {
        const encryptionKey = crypto.getRandomValues(new Uint8Array(256 / 8));

        const cipher = new aesjs.ModeOfOperation.ctr(
            encryptionKey,
            new aesjs.Counter(1),
        );
        const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));

        await SecureStore.setItemAsync(
            key,
            aesjs.utils.hex.fromBytes(encryptionKey),
        );

        return aesjs.utils.hex.fromBytes(encryptedBytes);
    }

    private async _decrypt(key: string, value: string) {
        const encryptionKeyHex = await SecureStore.getItemAsync(key);
        if (!encryptionKeyHex) {
            return encryptionKeyHex;
        }

        const cipher = new aesjs.ModeOfOperation.ctr(
            aesjs.utils.hex.toBytes(encryptionKeyHex),
            new aesjs.Counter(1),
        );
        const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));

        return aesjs.utils.utf8.fromBytes(decryptedBytes);
    }

    async getItem(key: string) {
        const encrypted = await AsyncStorage.getItem(key);
        if (!encrypted) {
            return encrypted;
        }

        return this._decrypt(key, encrypted);
    }

    async removeItem(key: string) {
        await AsyncStorage.removeItem(key);
        await SecureStore.deleteItemAsync(key);
    }

    async setItem(key: string, value: string) {
        const encrypted = await this._encrypt(key, value);

        await AsyncStorage.setItem(key, encrypted);
    }
}

const EXPO_PUBLIC_SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL_REMOTE;
const EXPO_PUBLIC_SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY_REMOTE;

const supabaseUrl = EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
        auth: {
            ...(Platform.OS !== 'web'
                ? { storage: new LargeSecureStore() }
                : {}),
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    },
);

export default supabase;
