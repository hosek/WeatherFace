import * as SecureStore from 'expo-secure-store';
import { User } from '@/types';
const USER_KEY = 'user_key';

export async function saveUserToSecureStore(user: User) {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function getUserFromSecureStore() {
  return await SecureStore.getItemAsync(USER_KEY);
}

export async function removeUserFromSecureStore() {
  await SecureStore.deleteItemAsync(USER_KEY);
}
