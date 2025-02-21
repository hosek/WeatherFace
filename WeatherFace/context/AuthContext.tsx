import React, {
  Dispatch,
  createContext,
  useCallback,
  useReducer,
  ReactNode,
} from 'react';
import bcrypt from 'react-native-bcrypt';

import {
  saveUserToSecureStore,
  getUserFromSecureStore,
  removeUserFromSecureStore,
} from '@/utils/SecureStore';
import { User, SignInFormData, SignUpFormData } from '@/types';

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
};

type AuthAction =
  | { type: 'SIGN_IN'; payload: User }
  | { type: 'SIGN_UP'; payload: User }
  | { type: 'UPDATE_PROFILE'; payload: User }
  | { type: 'SIGN_OUT' };

export type AuthContextType = {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
  signOut: () => Promise<void>;
  signIn: (formData: SignInFormData) => Promise<void>;
  signUp: (formData: SignUpFormData) => Promise<void>;
  updateProfile: (user: User) => Promise<void>;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SIGN_IN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'SIGN_UP':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'UPDATE_PROFILE':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'SIGN_OUT':
      return { ...state, user: null, isAuthenticated: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const signIn = useCallback(async (formData: SignInFormData) => {
    const dbUser = await getUserFromSecureStore();
    if (dbUser) {
      const currentUser = JSON.parse(dbUser);
      bcrypt.compare(
        formData.password,
        currentUser.password,
        (err, isMatch) => {
          if (isMatch) {
            dispatch({ type: 'SIGN_IN', payload: currentUser });
          }
        },
      );
      //TODO Wrong password state
    }
  }, []);

  const signUp = useCallback(async (formData: SignUpFormData) => {
    bcrypt.hash(formData.password, 10, async (err, hashedPassword) => {
      if (hashedPassword) {
        const newUser: User = { ...formData, password: hashedPassword };
        await saveUserToSecureStore(newUser);
        dispatch({ type: 'SIGN_UP', payload: newUser });
      } else if (err) {
        console.log(err);
      }
      //TODO Password hash error handling
    });
  }, []);

  const updateProfile = useCallback(async (user: User) => {
    await saveUserToSecureStore(user);
    dispatch({ type: 'UPDATE_PROFILE', payload: user });
  }, []);

  const signOut = useCallback(async () => {
    await removeUserFromSecureStore();
    dispatch({ type: 'SIGN_OUT' });
  }, []);

  return (
    <AuthContext.Provider
      value={{ state, dispatch, updateProfile, signOut, signUp, signIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};
